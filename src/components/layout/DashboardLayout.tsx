import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Upload, 
  FileQuestion, 
  FileText, 
  BookA, 
  Lightbulb, 
  Key, 
  History, 
  Settings, 
  LogOut,
  Moon,
  Sun,
  Menu,
  X
} from 'lucide-react';
import './DashboardLayout.css';

interface DashboardLayoutProps {
  children: React.ReactNode;
  toggleTheme: () => void;
  theme: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, toggleTheme, theme }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/upload', icon: <Upload size={20} />, label: 'Upload' },
    { path: '/results?tab=questions', icon: <FileQuestion size={20} />, label: 'Question Generator' },
    { path: '/results?tab=summary', icon: <FileText size={20} />, label: 'Summary' },
    { path: '/results?tab=vocabulary', icon: <BookA size={20} />, label: 'Vocabulary' },
    { path: '/results?tab=keypoints', icon: <Lightbulb size={20} />, label: 'Key Points' },
    { path: '/results?tab=keywords', icon: <Key size={20} />, label: 'Keywords' },
    { path: '/history', icon: <History size={20} />, label: 'History' },
    { path: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  const navigateTo = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="dashboard-layout">
      {/* Mobile Header */}
      <div className="mobile-header">
        <div className="logo gradient-text">StudyGen AI</div>
        <div className="mobile-header-actions">
          <button onClick={toggleTheme} className="theme-toggle-btn">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`sidebar glass ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo gradient-text">StudyGen AI</div>
        </div>
        
        <div className="sidebar-nav">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path.split('?')[0];
            return (
              <button 
                key={index} 
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => navigateTo(item.path)}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>

        <div className="sidebar-footer">
          <button className="nav-item logout" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-navigation glass">
          <div className="search-bar">
            {/* Placeholder for search */}
            <input type="text" placeholder="Search..." className="search-input" />
          </div>
          <div className="top-nav-actions">
            <button onClick={toggleTheme} className="theme-toggle-btn desktop-only">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="profile-avatar">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${localStorage.getItem('user') || 'user'}`} alt="Profile" />
            </div>
          </div>
        </header>
        
        <div className="content-area page-transition">
          {children}
        </div>
      </main>
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}
    </div>
  );
};

export default DashboardLayout;
