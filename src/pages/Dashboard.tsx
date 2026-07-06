import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { Upload, FileQuestion, BookA, Lightbulb, Clock } from 'lucide-react';
import './Dashboard.css';

interface Props {
  toggleTheme: () => void;
  theme: string;
}

const Dashboard: React.FC<Props> = ({ toggleTheme, theme }) => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('user') || 'Student';

  const quickActions = [
    { title: 'Upload Document', icon: <Upload size={24} />, path: '/upload', color: 'var(--primary-color)' },
    { title: 'View History', icon: <Clock size={24} />, path: '/history', color: 'var(--secondary-color)' },
  ];

  const features = [
    { title: 'Generate Questions', desc: 'MCQs, True/False, Short answers', icon: <FileQuestion size={24} /> },
    { title: 'Smart Summary', desc: 'Get concise bullet points', icon: <BookA size={24} /> },
    { title: 'Key Points Extraction', desc: 'Identify core concepts instantly', icon: <Lightbulb size={24} /> },
  ];

  return (
    <DashboardLayout toggleTheme={toggleTheme} theme={theme}>
      <div className="dashboard-container animate-fade-in">
        <header className="dashboard-header">
          <h1 className="gradient-text">Welcome back, {userName}!</h1>
          <p>Ready to supercharge your study session today?</p>
        </header>

        <section className="quick-actions">
          {quickActions.map((action, idx) => (
            <div 
              key={idx} 
              className="action-card glass animate-slide-up" 
              style={{ animationDelay: `${idx * 0.1}s` }}
              onClick={() => navigate(action.path)}
            >
              <div className="action-icon" style={{ color: action.color }}>
                {action.icon}
              </div>
              <h3>{action.title}</h3>
            </div>
          ))}
        </section>

        <section className="features-preview">
          <h2>What you can do with StudyGen AI</h2>
          <div className="features-grid">
            {features.map((feature, idx) => (
              <div key={idx} className="feature-card glass animate-slide-up" style={{ animationDelay: `${(idx + 2) * 0.1}s` }}>
                <div className="feature-icon">{feature.icon}</div>
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
