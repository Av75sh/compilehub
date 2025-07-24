import { useState, useEffect } from 'react';
import AuthModal from './components/AuthModal/AuthModal';
import Sidebar from './components/Sidebar/Sidebar';
import CodeEditor from './components/CodeEditor/CodeEditor';
import { checkAuthStatus, logoutUser } from './utils/api';

const App = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('C');
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await checkAuthStatus();
      if (user) {
        setUser(user);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    const success = await logoutUser();
    if (success) {
      setUser(null);
      alert('Logged out successfully!');
    }
  };

  const handleLanguageSelect = (lang, defaultCode) => {
    setSelectedLanguage(lang);
  };

  return (
    <div style={{ 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#f5f6f7',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      <header style={{
        backgroundColor: '#ffffff',
        padding: '12px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          margin: 0,
          fontSize: '24px',
          fontWeight: '600',
          color: '#333333'
        }}>
          CompileHub
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {user ? (
            <>
              <span style={{ color: '#333333', fontSize: '14px' }}>
                Welcome, {user.username}!
              </span>
              <button 
                onClick={handleLogout}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#ef4444',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <button 
              onClick={() => setShowAuthModal(true)}
              style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: '2px solid #2563eb',
                borderRadius: '6px',
                color: '#2563eb',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Login
            </button>
          )}
        </div>
      </header>

      <AuthModal 
        showAuthModal={showAuthModal}
        setShowAuthModal={setShowAuthModal}
        setUser={setUser}
      />

      <div style={{ 
        display: 'flex', 
        flex: 1,
        gap: '0'
      }}>
        <Sidebar 
          selectedLanguage={selectedLanguage}
          onLanguageSelect={handleLanguageSelect}
        />

        <CodeEditor 
          selectedLanguage={selectedLanguage}
          user={user}
          setShowAuthModal={setShowAuthModal}
        />
      </div>
    </div>
  );
};

export default App;