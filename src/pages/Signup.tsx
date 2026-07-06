import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import './Auth.css';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (name) {
      localStorage.setItem('user', name);
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass animate-fade-in">
        <div className="auth-header">
          <h2 className="gradient-text">Create Account</h2>
          <p>Join StudyGen AI today.</p>
        </div>
        
        <form onSubmit={handleSignup} className="auth-form">
          <div className="input-group">
            <label>Full Name</label>
            <div className="input-wrapper">
              <User size={20} className="input-icon" />
              <input 
                type="text" 
                placeholder="John Doe" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail size={20} className="input-icon" />
              <input type="email" placeholder="you@example.com" required />
            </div>
          </div>
          
          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={20} className="input-icon" />
              <input type="password" placeholder="••••••••" required />
            </div>
          </div>
          
          <button type="submit" className="btn-primary full-width">
            Sign Up <ArrowRight size={20} />
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Already have an account? <Link to="/login" className="auth-link">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
