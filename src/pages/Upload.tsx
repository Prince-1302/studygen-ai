import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Type,
  File as FileIcon,
  X,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { extractTextFromFile } from '../services/parser';
import { generateStudyMaterial, generateStudyMaterialFromImage } from '../services/ai';
import './Upload.css';

interface Props {
  toggleTheme: () => void;
  theme: string;
}

const PROCESSING_STEPS = [
  'Reading your file...',
  'Extracting content...',
  'Analyzing with AI...',
  'Generating Questions...',
  'Building Summary...',
  'Finding Vocabulary...',
  'Extracting Key Points...',
  'Finalizing Results...',
];

const Upload: React.FC<Props> = ({ toggleTheme, theme }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'file' | 'text'>('file');
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length > 0) handleFileSelection(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) handleFileSelection(e.target.files[0]);
  };

  const handleFileSelection = (selectedFile: File) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(selectedFile.type)) {
      setErrorMsg('Unsupported file. Please upload a PDF or Image (JPG, PNG).');
      return;
    }
    if (selectedFile.size > 20 * 1024 * 1024) {
      setErrorMsg('File size exceeds 20 MB limit.');
      return;
    }
    setFile(selectedFile);
    setErrorMsg('');
  };

  // Animate through the processing steps
  const animateSteps = () => {
    let step = 0;
    setProcessingStep(0);
    const interval = setInterval(() => {
      step++;
      if (step < PROCESSING_STEPS.length) {
        setProcessingStep(step);
      } else {
        clearInterval(interval);
      }
    }, 1800);
    return interval;
  };

  const processAndGenerate = async () => {
    if (activeTab === 'file' && !file) return;
    if (activeTab === 'text' && !pastedText.trim()) return;

    setIsProcessing(true);
    setErrorMsg('');

    const stepInterval = animateSteps();

    try {
      let generatedData: any;

      if (activeTab === 'file' && file) {
        const isImage = file.type.startsWith('image/');

        if (isImage) {
          // For images: send directly to Gemini Vision — no OCR needed
          generatedData = await generateStudyMaterialFromImage(file);
        } else {
          // For PDFs: extract text then pass to AI
          const sourceText = await extractTextFromFile(file);
          generatedData = await generateStudyMaterial(sourceText);
        }
      } else {
        generatedData = await generateStudyMaterial(pastedText);
      }

      clearInterval(stepInterval);

      // Save generated study material to localStorage so Results page can read it
      localStorage.setItem('study_material_current', JSON.stringify(generatedData));

      // Also save to history
      const history = JSON.parse(localStorage.getItem('study_history') || '[]');
      history.unshift({
        id: Date.now(),
        title: file ? file.name : 'Pasted Text',
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        type: file ? (file.type === 'application/pdf' ? 'PDF' : 'Image') : 'Text',
        data: generatedData,
      });
      localStorage.setItem('study_history', JSON.stringify(history.slice(0, 20))); // keep last 20

      setIsProcessing(false);
      navigate('/results?tab=questions');
    } catch (error: any) {
      clearInterval(stepInterval);
      console.error(error);
      setErrorMsg(error.message || 'An unexpected error occurred. Please try again.');
      setIsProcessing(false);
    }
  };

  const isImage = file?.type?.startsWith('image/');

  return (
    <DashboardLayout toggleTheme={toggleTheme} theme={theme}>
      <div className="upload-container animate-fade-in">
        <header className="upload-header">
          <h2>Create New Study Material</h2>
          <p>Upload a file or paste text to let AI do the magic.</p>
        </header>

        <div className="upload-card glass">
          <div className="upload-tabs">
            <button
              className={`tab-btn ${activeTab === 'file' ? 'active' : ''}`}
              onClick={() => { setActiveTab('file'); setErrorMsg(''); }}
            >
              <FileIcon size={18} /> Upload File (PDF / Image)
            </button>
            <button
              className={`tab-btn ${activeTab === 'text' ? 'active' : ''}`}
              onClick={() => { setActiveTab('text'); setErrorMsg(''); }}
            >
              <Type size={18} /> Paste Text
            </button>
          </div>

          <div className="upload-content">
            {/* Error Banner */}
            {errorMsg && (
              <div className="error-banner">
                <AlertCircle size={18} />
                <span>{errorMsg}</span>
                <button onClick={() => setErrorMsg('')}><X size={16} /></button>
              </div>
            )}

            {activeTab === 'file' ? (
              <div
                className={`dropzone ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
              >
                {!file ? (
                  <>
                    <UploadCloud size={48} className="drop-icon" />
                    <h3>Drag & Drop your file here</h3>
                    <p>Supports PDF, PNG, JPG (Max 20 MB)</p>
                    <div className="divider"><span>OR</span></div>
                    <label className="btn-secondary browse-btn">
                      Browse Files
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={handleFileChange}
                        hidden
                      />
                    </label>
                  </>
                ) : (
                  <>
                    <div className="file-preview">
                      <div className="file-preview-icon gradient-bg">
                        {isImage ? <ImageIcon size={32} /> : <FileText size={32} />}
                      </div>
                      <div className="file-info">
                        <h4>{file.name}</h4>
                        <p>
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                          {isImage && (
                            <span className="vision-badge"> · Gemini Vision</span>
                          )}
                        </p>
                      </div>
                      <button className="remove-btn" onClick={() => setFile(null)}>
                        <X size={20} />
                      </button>
                    </div>
                    {isImage && (
                      <p className="vision-note">
                        ✨ Image will be sent directly to Gemini Vision for maximum accuracy.
                      </p>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="text-input-area">
                <textarea
                  placeholder="Paste your paragraph, notes, or topic here… (50+ words recommended for best results)"
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  rows={9}
                />
                <div className="word-count">
                  {pastedText.trim().split(/\s+/).filter(Boolean).length} words
                </div>
              </div>
            )}

            {/* Processing State */}
            {isProcessing ? (
              <div className="processing-indicator">
                <Loader2 size={36} className="spinner text-primary" />
                <h3 className="gradient-text">{PROCESSING_STEPS[processingStep]}</h3>
                <p className="processing-sub">Please wait, this may take 10–30 seconds…</p>
                <div className="progress-bar-container">
                  <div className="progress-bar" />
                </div>
              </div>
            ) : (
              <button
                className="btn-primary large full-width generate-btn"
                onClick={processAndGenerate}
                disabled={
                  (activeTab === 'file' && !file) ||
                  (activeTab === 'text' && !pastedText.trim())
                }
              >
                Generate Study Material <UploadCloud size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Upload;
