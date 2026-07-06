import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Moon, Sun, Globe, Save, Key } from 'lucide-react';
import './Settings.css';

interface Props {
  toggleTheme: () => void;
  theme: string;
}

const Settings: React.FC<Props> = ({ toggleTheme, theme }) => {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    // Fall back to the env variable if no key saved yet — auto-configures on first load
    const envKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    const keyToUse = storedKey || envKey;
    if (keyToUse) {
      setApiKey(keyToUse);
      // Persist it so ai.ts can always read from localStorage
      if (!storedKey && envKey) localStorage.setItem('gemini_api_key', envKey);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('gemini_api_key', apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <DashboardLayout toggleTheme={toggleTheme} theme={theme}>
      <div className="settings-container animate-fade-in">
        <header className="settings-header">
          <h2>Settings</h2>
          <p>Customize your StudyGen AI experience.</p>
        </header>

        <div className="settings-card glass">
          <div className="settings-section">
            <div className="section-info">
              <h3>Appearance</h3>
              <p>Choose between light and dark themes.</p>
            </div>
            <div className="section-content">
              <button className="theme-toggle-large" onClick={toggleTheme}>
                {theme === 'dark' ? (
                  <><Sun size={24} /> Switch to Light Mode</>
                ) : (
                  <><Moon size={24} /> Switch to Dark Mode</>
                )}
              </button>
            </div>
          </div>

          <hr className="divider-line" />

          <div className="settings-section">
            <div className="section-info">
              <h3>Language Preference</h3>
              <p>Select your primary language for generated materials.</p>
            </div>
            <div className="section-content">
              <div className="language-select">
                <Globe size={20} className="text-secondary" />
                <select defaultValue="en">
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="divider-line" />

          <div className="settings-section">
            <div className="section-info">
              <h3>Google Gemini API Key</h3>
              <p>Enter your API key to generate study materials. Your key is stored locally in your browser.</p>
            </div>
            <div className="section-content api-key-section">
              <div className="input-wrapper" style={{ width: '100%', maxWidth: '350px' }}>
                <Key size={20} className="input-icon" />
                <input 
                  type="password" 
                  placeholder="AIzaSy..." 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <hr className="divider-line" />

          <div className="settings-actions">
            <button className="btn-primary" onClick={handleSave}>
              <Save size={18} /> {saved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
