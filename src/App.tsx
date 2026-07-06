import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Results from './pages/Results';
import History from './pages/History';
import Settings from './pages/Settings';
import './App.css';

const App = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Simple auth check for routing
  const isAuthenticated = !!localStorage.getItem('user');

  return (
    <BrowserRouter>
      <div className={`app-container ${theme}`}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            isAuthenticated ? <Dashboard toggleTheme={toggleTheme} theme={theme} /> : <Navigate to="/login" />
          } />
          <Route path="/upload" element={
            isAuthenticated ? <Upload toggleTheme={toggleTheme} theme={theme} /> : <Navigate to="/login" />
          } />
          <Route path="/results" element={
            isAuthenticated ? <Results toggleTheme={toggleTheme} theme={theme} /> : <Navigate to="/login" />
          } />
          <Route path="/history" element={
            isAuthenticated ? <History toggleTheme={toggleTheme} theme={theme} /> : <Navigate to="/login" />
          } />
          <Route path="/settings" element={
            isAuthenticated ? <Settings toggleTheme={toggleTheme} theme={theme} /> : <Navigate to="/login" />
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
