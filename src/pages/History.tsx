import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { FileText, Image as ImageIcon, Type, Search, Trash2, ExternalLink, Calendar, Clock } from 'lucide-react';
import './History.css';

interface Props {
  toggleTheme: () => void;
  theme: string;
}

interface HistoryItem {
  id: number;
  title: string;
  date: string;
  type: 'PDF' | 'Image' | 'Text';
  data: any;
}

const typeIcon = (type: string) => {
  if (type === 'PDF')   return <FileText size={22} />;
  if (type === 'Image') return <ImageIcon size={22} />;
  return <Type size={22} />;
};

const typeBadgeClass = (type: string) => {
  if (type === 'PDF')   return 'type-pdf';
  if (type === 'Image') return 'type-image';
  return 'type-text';
};

const getDayName = (dateStr: string) => {
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-IN', { weekday: 'long' });
};

const History: React.FC<Props> = ({ toggleTheme, theme }) => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Load history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('study_history');
    if (stored) {
      try { setHistory(JSON.parse(stored)); }
      catch { setHistory([]); }
    }
  }, []);

  const filtered = history.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.type.toLowerCase().includes(search.toLowerCase())
  );

  // Open a history item → load its data into current and navigate to results
  const handleOpen = (item: HistoryItem) => {
    localStorage.setItem('study_material_current', JSON.stringify(item.data));
    navigate('/results?tab=questions');
  };

  // Delete one item
  const handleDelete = (id: number) => {
    const updated = history.filter(h => h.id !== id);
    setHistory(updated);
    localStorage.setItem('study_history', JSON.stringify(updated));
    setDeleteConfirm(null);
  };

  // Clear all history
  const handleClearAll = () => {
    setHistory([]);
    localStorage.removeItem('study_history');
  };

  return (
    <DashboardLayout toggleTheme={toggleTheme} theme={theme}>
      <div className="history-container animate-fade-in">
        <header className="history-header">
          <div>
            <h2>Study History</h2>
            <p>Access and reopen all your previously generated study materials.</p>
          </div>
          {history.length > 0 && (
            <button className="clear-all-btn" onClick={handleClearAll}>
              <Trash2 size={16} /> Clear All
            </button>
          )}
        </header>

        {/* Search bar */}
        <div className="history-search glass">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search by file name or type (PDF, Image, Text)…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="history-empty glass">
            <Clock size={48} style={{ color: 'var(--text-tertiary)', marginBottom: 16 }} />
            <h3>No history found</h3>
            <p>{history.length === 0
              ? 'Upload a document and generate study material to start your history.'
              : 'No results match your search.'}
            </p>
            {history.length === 0 && (
              <button className="btn-primary" style={{ marginTop: 20 }} onClick={() => navigate('/upload')}>
                Upload Now
              </button>
            )}
          </div>
        )}

        {/* History list */}
        <div className="history-list">
          {filtered.map((item, idx) => (
            <div
              key={item.id}
              className="history-item glass animate-slide-up"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              {/* Icon */}
              <div className={`history-icon ${typeBadgeClass(item.type)}`}>
                {typeIcon(item.type)}
              </div>

              {/* Details */}
              <div className="history-details">
                <h3 className="history-title">{item.title}</h3>
                <div className="history-meta">
                  <span className="meta-chip">
                    <Calendar size={13} /> {item.date}
                  </span>
                  {getDayName(item.date) && (
                    <span className="meta-chip">
                      <Clock size={13} /> {getDayName(item.date)}
                    </span>
                  )}
                  <span className={`type-chip type-chip-${item.type.toLowerCase()}`}>
                    {item.type}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="history-actions">
                <button className="btn-primary open-btn" onClick={() => handleOpen(item)}>
                  <ExternalLink size={16} /> Open
                </button>
                {deleteConfirm === item.id ? (
                  <div className="delete-confirm">
                    <span>Delete?</span>
                    <button className="confirm-yes" onClick={() => handleDelete(item.id)}>Yes</button>
                    <button className="confirm-no"  onClick={() => setDeleteConfirm(null)}>No</button>
                  </div>
                ) : (
                  <button className="delete-btn" onClick={() => setDeleteConfirm(item.id)}>
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default History;
