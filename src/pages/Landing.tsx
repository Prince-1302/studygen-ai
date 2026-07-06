import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Zap, Brain, ChevronRight, FileText, BookOpen, FileQuestion, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import './Landing.css';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="landing-nav glass">
        <div className="logo gradient-text">StudyGen AI</div>
        <div className="nav-actions">
          <button className="btn-ghost" onClick={() => navigate('/login')}>Login</button>
          <button className="btn-primary" onClick={() => navigate('/signup')}>Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <motion.div 
            className="hero-badge glass"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles size={16} className="text-primary" />
            <span>AI-Powered Study Assistant</span>
          </motion.div>
          
          <motion.h1 {...fadeIn} className="hero-title">
            Transform Any Material Into <br />
            <span className="gradient-text">Complete Study Guides</span>
          </motion.h1>
          
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Upload any Paragraph, Image, or PDF and instantly generate complete study material including Questions, Summaries, and Key Points using AI.
          </motion.p>
          
          <motion.div 
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button className="btn-primary large" onClick={() => navigate('/signup')}>
              Get Started <ChevronRight size={20} />
            </button>
            <button className="btn-secondary large" onClick={() => navigate('/login')}>
              Try Demo
            </button>
          </motion.div>
        </div>

        {/* Floating Illustration / Cards */}
        <div className="hero-illustration">
          <motion.div 
            className="floating-card glass card-1"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <FileText size={24} className="icon-blue" />
            <div>
              <h4>PDF Extracted</h4>
              <p>23 pages analyzed</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="floating-card glass card-2"
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Brain size={24} className="icon-pink" />
            <div>
              <h4>MCQs Generated</h4>
              <p>15 High-order questions</p>
            </div>
          </motion.div>

          <motion.div 
            className="floating-card glass card-3"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <BookOpen size={24} className="icon-green" />
            <div>
              <h4>Summary Ready</h4>
              <p>Detailed & concise</p>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Supercharge Your Studies</h2>
          <p>Everything you need to master any subject in seconds.</p>
        </div>
        
        <div className="features-grid">
          {[
            { icon: <FileQuestion size={32} />, title: 'Smart Question Generator', desc: 'Auto-generate MCQs, True/False, and Long Answer questions based on your material.' },
            { icon: <BookOpen size={32} />, title: 'Concise Summaries', desc: 'Get one-line, bullet-point, or detailed summaries of long boring texts.' },
            { icon: <Zap size={32} />, title: 'Important Vocabulary', desc: 'Automatically extract key terms with meanings, synonyms, and examples.' },
            { icon: <Lightbulb size={32} />, title: 'Key Points Extraction', desc: 'Instantly identify core concepts, definitions, and exam-oriented facts.' }
          ].map((feature, idx) => (
            <motion.div 
              key={idx} 
              className="feature-box glass"
              whileHover={{ y: -10, scale: 1.02 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="feature-icon-wrapper gradient-bg">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="logo gradient-text">StudyGen AI</div>
        <p>&copy; {new Date().getFullYear()} StudyGen AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
