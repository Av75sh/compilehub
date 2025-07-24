import './AuthModal.css';
import { useState } from 'react';
import { registerUser, loginUser } from '../../utils/api';

const AuthModal = ({ showAuthModal, setShowAuthModal, setUser }) => {
  const [authMode, setAuthMode] = useState('login'); 
  const [authData, setAuthData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [authLoading, setAuthLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      if (authMode === 'register') {
        const result = await registerUser(authData);
        if (result.success) {
          alert('Registration successful! Please login.');
          setAuthMode('login');
          setAuthData({ username: '', email: '', password: '' });
        } else {
          alert(result.message || 'Registration failed');
        }
      } else {
        const result = await loginUser(authData);
        if (result.success) {
          setUser(result.user);
          setShowAuthModal(false);
          setAuthData({ username: '', email: '', password: '' });
          alert(`Welcome back, ${result.user.username}!`);
        } else {
          alert(result.message || 'Login failed');
        }
      }
    } catch (error) {
      alert(error.message);
      console.error('Auth error:', error);
    } finally {
      setAuthLoading(false);
    }
  };

  if (!showAuthModal) return null;

  return (
    <div className="auth-overlay">
      <div className="auth-container">
        <h2 className="auth-heading">
          {authMode === 'login' ? 'Login to compilehub' : 'Register for compilehub'}
        </h2>
        
        <form onSubmit={handleAuth}>
          {authMode === 'register' && (
            <div className="auth-field">
              <label className="auth-label">Username</label>
              <input
                type="text"
                value={authData.username}
                onChange={(e) => setAuthData({...authData, username: e.target.value})}
                className="auth-input"
                required
              />
            </div>
          )}
          
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input
              type="email"
              value={authData.email}
              onChange={(e) => setAuthData({...authData, email: e.target.value})}
              className="auth-input"
              required
            />
          </div>
          
          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input
              type="password"
              value={authData.password}
              onChange={(e) => setAuthData({...authData, password: e.target.value})}
              className="auth-input"
              required
              minLength={6}
            />
          </div>
          
          <div className="auth-buttons">
            <button
              type="button"
              onClick={() => setShowAuthModal(false)}
              className="auth-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={authLoading}
              className={`auth-submit ${authLoading ? 'auth-loading' : ''}`}
            >
              {authLoading ? 'Please wait...' : (authMode === 'login' ? 'Login' : 'Register')}
            </button>
          </div>
        </form>
        
        <div className="auth-toggle">
          <button
            type="button"
            onClick={() => {
              setAuthMode(authMode === 'login' ? 'register' : 'login');
              setAuthData({ username: '', email: '', password: '' });
            }}
            className="auth-toggle-btn"
          >
            {authMode === 'login'
              ? "Don't have an account? Register"
              : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
