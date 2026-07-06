import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import {
  Copy, RefreshCw, Download, Printer, Check,
  AlertCircle, Languages, Search, Loader2, Plus, X, RotateCcw
} from 'lucide-react';
import { translateSummary, analyzeWord } from '../services/ai';
import './Results.css';

interface Props {
  toggleTheme: () => void;
  theme: string;
}

const TABS = [
  { id: 'questions',  label: 'Questions' },
  { id: 'summary',    label: 'Summary' },
  { id: 'vocabulary', label: 'Vocabulary' },
  { id: 'keypoints',  label: 'Key Points' },
  { id: 'keywords',   label: 'Keywords' },
];

const Results: React.FC<Props> = ({ toggleTheme, theme }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'questions';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [copied, setCopied] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState(false);
  const [savingPDF, setSavingPDF] = useState(false);
  const printableRef = useRef<HTMLDivElement>(null);

  // ── Summary Translation ──
  const [translatedSummary, setTranslatedSummary] = useState<any>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showTranslated, setShowTranslated] = useState(false);

  // ── Word Analyzer ──
  const [wordInput, setWordInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedWord, setAnalyzedWord] = useState<any>(null);
  const [wordError, setWordError] = useState('');
  const [showAnalyzer, setShowAnalyzer] = useState(true); // toggle between input and result

  // ── Question Filter ──
  const [qFilter, setQFilter] = useState('All');

  useEffect(() => { setActiveTab(initialTab); }, [initialTab]);

  useEffect(() => {
    const storedData = localStorage.getItem('study_material_current');
    if (storedData) {
      try { setData(JSON.parse(storedData)); }
      catch { setError(true); }
    } else { setError(true); }
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`/results?tab=${tab}`, { replace: true });
  };

  const handleCopy = () => {
    if (!data) return;
    const content = activeTab === 'summary' && showTranslated && translatedSummary
      ? translatedSummary : data[activeTab as keyof typeof data];
    navigator.clipboard.writeText(JSON.stringify(content, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Save PDF using html2canvas + jsPDF ──
  const handleSavePDF = async () => {
    if (!printableRef.current) return;
    setSavingPDF(true);
    try {
      const { default: html2canvas } = await import('html2canvas');
      const { default: jsPDF }       = await import('jspdf');

      const el = printableRef.current;
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: document.documentElement.getAttribute('data-theme') === 'dark' ? '#0f172a' : '#ffffff',
        windowWidth: el.scrollWidth,
        windowHeight: el.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgW  = pageW;
      const imgH  = (canvas.height * imgW) / canvas.width;
      let y = 0;

      while (y < imgH) {
        pdf.addImage(imgData, 'PNG', 0, -y, imgW, imgH);
        if (y + pageH < imgH) pdf.addPage();
        y += pageH;
      }

      const fileName = `StudyGen_${activeTab}_${new Date().toLocaleDateString('en-IN').replace(/\//g, '-')}.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error('PDF save failed:', err);
      alert('Could not save PDF. Please try the Print option instead.');
    }
    setSavingPDF(false);
  };

  // ── Translate summary bi-directionally ──
  const handleTranslate = async () => {
    if (translatedSummary) { setShowTranslated(!showTranslated); return; }
    setIsTranslating(true);
    try {
      const result = await translateSummary(data.summary);
      setTranslatedSummary(result);
      setShowTranslated(true);
    } catch (e: any) {
      alert(e.message || 'Translation failed. Please try again.');
    }
    setIsTranslating(false);
  };

  // ── Analyze a custom word ──
  const handleAnalyzeWord = async () => {
    if (!wordInput.trim()) return;
    setIsAnalyzing(true);
    setWordError('');
    setAnalyzedWord(null);
    try {
      const result = await analyzeWord(wordInput.trim());
      setAnalyzedWord(result);
      setShowAnalyzer(false); // hide input, show result
    } catch (e: any) {
      setWordError(e.message || 'Word analysis failed. Please try again.');
    }
    setIsAnalyzing(false);
  };

  // ── Reset word analyzer for a new search ──
  const handleNewWordSearch = () => {
    setAnalyzedWord(null);
    setWordInput('');
    setWordError('');
    setShowAnalyzer(true);
  };

  const questionTypes = data?.questions
    ? ['All', ...Array.from(new Set(data.questions.map((q: any) => q.type))) as string[]]
    : ['All'];

  const filteredQuestions = data?.questions?.filter(
    (q: any) => qFilter === 'All' || q.type === qFilter
  ) || [];

  if (error || !data) {
    return (
      <DashboardLayout toggleTheme={toggleTheme} theme={theme}>
        <div className="results-container animate-fade-in" style={{ textAlign: 'center', paddingTop: '100px' }}>
          <AlertCircle size={64} style={{ margin: '0 auto 20px', color: 'var(--text-tertiary)' }} />
          <h2>No Study Material Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
            You haven't generated any study material yet, or the session expired.
          </p>
          <button className="btn-primary" onClick={() => navigate('/upload')}>Go to Upload Page</button>
        </div>
      </DashboardLayout>
    );
  }

  const activeSummary = showTranslated && translatedSummary ? translatedSummary : data.summary;

  return (
    <DashboardLayout toggleTheme={toggleTheme} theme={theme}>
      <div className="results-container animate-fade-in">

        {/* ── Header ── */}
        <header className="results-header no-print">
          <div>
            <h2>Study Material Generated!</h2>
            <p>Your personalized study guide is ready.</p>
          </div>
          <div className="results-actions">
            <button className="action-btn" onClick={handleCopy}>
              {copied ? <Check size={18} className="text-success" /> : <Copy size={18} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button className="action-btn" onClick={() => navigate('/upload')}>
              <RefreshCw size={18} /> New
            </button>
            <button className="action-btn save-pdf-btn" onClick={handleSavePDF} disabled={savingPDF}>
              {savingPDF ? <Loader2 size={18} className="spinner" /> : <Download size={18} />}
              {savingPDF ? 'Saving…' : 'Save PDF'}
            </button>
            <button className="action-btn" onClick={() => window.print()}>
              <Printer size={18} /> Print
            </button>
          </div>
        </header>

        {/* ── Tabs ── */}
        <div className="results-tabs no-print">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`result-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Printable Content Area ── */}
        <div className="results-content printable-area" ref={printableRef}>

          {/* ══ QUESTIONS ══ */}
          {activeTab === 'questions' && data.questions && (
            <div className="module-container">
              <div className="module-header">
                <h3>Practice Questions <span className="q-count">({filteredQuestions.length} questions)</span></h3>
              </div>
              <div className="q-type-filter no-print">
                {questionTypes.map((type: string) => (
                  <button key={type} className={`q-filter-pill ${qFilter === type ? 'active' : ''}`} onClick={() => setQFilter(type)}>
                    {type}
                  </button>
                ))}
              </div>
              <div className="grid-list">
                {filteredQuestions.map((q: any, i: number) => (
                  <div key={i} className="q-card glass animate-slide-up">
                    <div className="q-header">
                      <span className="q-type gradient-text">{q.type}</span>
                      <span className={`q-diff diff-${q.difficulty?.toLowerCase()}`}>{q.difficulty}</span>
                    </div>
                    <p className="q-text"><strong>Q{i + 1}:</strong> {q.question}</p>
                    {q.type === 'Match the Following' && q.matchData && (
                      <div className="match-table">
                        <div className="match-col">
                          <strong>Column A</strong>
                          {q.matchData.columnA?.map((item: string, j: number) => (
                            <div key={j} className="match-item">{j + 1}. {item}</div>
                          ))}
                        </div>
                        <div className="match-col">
                          <strong>Column B</strong>
                          {q.matchData.columnB?.map((item: string, j: number) => (
                            <div key={j} className="match-item">{String.fromCharCode(97 + j)}. {item}</div>
                          ))}
                        </div>
                      </div>
                    )}
                    {q.options && q.options.length > 0 && (
                      <ul className="q-options">
                        {q.options.map((opt: string, j: number) => (
                          <li key={j} className={opt === q.answer ? 'correct' : ''}>{opt}</li>
                        ))}
                      </ul>
                    )}
                    <div className="q-answer">
                      <strong>Answer:</strong> {q.answer}
                      <p className="q-explanation">{q.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ SUMMARY ══ */}
          {activeTab === 'summary' && data.summary && (
            <div className="module-container">
              <div className="module-header">
                <h3>Smart Summary</h3>
                <button className={`hindi-translate-btn no-print ${showTranslated ? 'active' : ''}`} onClick={handleTranslate} disabled={isTranslating}>
                  {isTranslating
                    ? <><Loader2 size={16} className="spinner" /> Translating…</>
                    : <><Languages size={16} /> {showTranslated ? 'View Original' : 'Translate Summary'}</>
                  }
                </button>
              </div>
              {showTranslated && (
                <div className="lang-badge">
                  <span>✨ Translated</span>
                  <button onClick={() => setShowTranslated(false)}><X size={14} /></button>
                </div>
              )}
              <div className="summary-card glass">
                <h4>One-Line Summary</h4>
                <p className="highlight-text">{activeSummary.oneLine}</p>
                <h4 className="mt-4">Bullet Points</h4>
                <ul className="bullet-list">
                  {activeSummary.bulletPoints?.map((bp: string, i: number) => <li key={i}>{bp}</li>)}
                </ul>
                <h4 className="mt-4">Detailed Summary</h4>
                <p className={showTranslated ? 'hindi-text' : ''}>{activeSummary.detailed}</p>
              </div>
            </div>
          )}

          {/* ══ VOCABULARY ══ */}
          {activeTab === 'vocabulary' && data.vocabulary && (
            <div className="module-container">
              <h3>Important Vocabulary</h3>

              {/* Word Analyzer Panel */}
              <div className="word-analyzer glass">
                <div className="analyzer-title-row">
                  <h4><Plus size={16} /> Analyze Any Word</h4>
                  {/* "Search New Word" button — shown only after a result exists */}
                  {analyzedWord && (
                    <button className="new-word-btn" onClick={handleNewWordSearch}>
                      <RotateCcw size={15} /> Search New Word
                    </button>
                  )}
                </div>

                {/* Input state */}
                {showAnalyzer && (
                  <>
                    <p className="analyzer-desc">Type any word below and get its complete analysis instantly.</p>
                    <div className="word-input-row">
                      <div className="word-input-wrapper">
                        <Search size={18} className="word-input-icon" />
                        <input
                          type="text"
                          placeholder="e.g. 'photosynthesis', 'democracy'…"
                          value={wordInput}
                          onChange={e => setWordInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleAnalyzeWord()}
                          autoFocus
                        />
                      </div>
                      <button className="btn-primary analyze-btn" onClick={handleAnalyzeWord} disabled={isAnalyzing || !wordInput.trim()}>
                        {isAnalyzing ? <Loader2 size={18} className="spinner" /> : <Search size={18} />}
                        {isAnalyzing ? 'Analyzing…' : 'Analyze'}
                      </button>
                    </div>
                    {wordError && <p className="word-error">{wordError}</p>}
                  </>
                )}

                {/* Result state — shown after analysis, input hidden */}
                {!showAnalyzer && analyzedWord && (
                  <div className="analyzed-result animate-slide-up">
                    <div className="vocab-header">
                      <h4 className="gradient-text">{analyzedWord.word}</h4>
                      <span className="pos-badge">{analyzedWord.pos}</span>
                    </div>
                    <p><strong>Meaning:</strong> {analyzedWord.meaning}</p>
                    {analyzedWord.hindiMeaning && <p className="hindi-text" style={{ margin: '4px 0' }}><strong>Hindi:</strong> {analyzedWord.hindiMeaning}</p>}
                    <p className="hinglish-text"><strong>Hinglish:</strong> {analyzedWord.hinglish}</p>
                    <div className="vocab-meta">
                      <span><strong>Synonym:</strong> {analyzedWord.synonym}</span>
                      <span><strong>Antonym:</strong> {analyzedWord.antonym}</span>
                    </div>
                    <div className="vocab-example"><em>"{analyzedWord.example}"</em></div>
                  </div>
                )}
              </div>

              {/* Existing vocabulary grid */}
              <div className="vocab-grid">
                {data.vocabulary.map((v: any, i: number) => (
                  <div key={i} className="vocab-card glass animate-slide-up">
                    <div className="vocab-header">
                      <h4 className="gradient-text">{v.word}</h4>
                      <span className="pos-badge">{v.pos}</span>
                    </div>
                    <p><strong>Meaning:</strong> {v.meaning}</p>
                    {v.hindiMeaning && <p className="hindi-text" style={{ margin: '4px 0' }}><strong>Hindi:</strong> {v.hindiMeaning}</p>}
                    <p className="hinglish-text"><strong>Hinglish:</strong> {v.hinglish}</p>
                    <div className="vocab-meta">
                      <span><strong>Synonym:</strong> {v.synonym}</span>
                      <span><strong>Antonym:</strong> {v.antonym}</span>
                    </div>
                    <div className="vocab-example"><em>"{v.example}"</em></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ KEY POINTS ══ */}
          {activeTab === 'keypoints' && data.keyPoints && (
            <div className="module-container">
              <h3>Key Points</h3>
              <div className="kp-grid">
                {data.keyPoints.concepts?.length > 0 && (
                  <div className="kp-section glass">
                    <h4>Core Concepts</h4>
                    <ul>{data.keyPoints.concepts.map((c: string, i: number) => <li key={i}>{c}</li>)}</ul>
                  </div>
                )}
                {data.keyPoints.definitions?.length > 0 && (
                  <div className="kp-section glass">
                    <h4>Important Definitions</h4>
                    <ul>{data.keyPoints.definitions.map((d: string, i: number) => <li key={i}>{d}</li>)}</ul>
                  </div>
                )}
                {data.keyPoints.facts?.length > 0 && (
                  <div className="kp-section glass">
                    <h4>Fast Facts</h4>
                    <ul>{data.keyPoints.facts.map((f: string, i: number) => <li key={i}>{f}</li>)}</ul>
                  </div>
                )}
                {data.keyPoints.importantSentences?.length > 0 && (
                  <div className="kp-section glass">
                    <h4>Important Sentences</h4>
                    <ul>{data.keyPoints.importantSentences.map((s: string, i: number) => <li key={i}>{s}</li>)}</ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══ KEYWORDS ══ */}
          {activeTab === 'keywords' && data.keywords && (
            <div className="module-container">
              <h3>Keyword Analysis</h3>
              <div className="keyword-grid">
                {data.keywords.map((k: any, i: number) => (
                  <div key={i} className="keyword-card glass animate-slide-up">
                    <div className="kw-header">
                      <h4>{k.keyword}</h4>
                      <span className={`importance ${k.importance?.toLowerCase()}`}>{k.importance}</span>
                    </div>
                    <p><strong>Meaning:</strong> {k.meaning}</p>
                    {k.hindiMeaning && <p className="hindi-text" style={{ margin: '4px 0' }}><strong>Hindi:</strong> {k.hindiMeaning}</p>}
                    <p className="hinglish-text"><strong>Hinglish:</strong> {k.hinglish}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>{/* end printable-area */}
      </div>
    </DashboardLayout>
  );
};

export default Results;
