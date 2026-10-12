import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, User as UserIcon, LogOut, FileText, Pill, HeartPulse } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const Navbar = ({ onToggleSidebar, isDashboard = true }) => {
  const { user, isAuthenticated, logout, textSize, setTextSize } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={isDashboard ? 'top-navbar' : 'landing-navbar'}>
      <div className={isDashboard ? '' : 'container landing-navbar-inner'}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {isDashboard && (
            <button
              onClick={onToggleSidebar}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
          )}

          {!isDashboard && (
            <Link to="/" className="brand-link">
              <div className="brand-icon">
                <HeartPulse size={22} />
              </div>
              <span>MediExplain</span>
            </Link>
          )}

          {!isDashboard && (
            <nav className="nav-links-desktop" style={{ marginLeft: '40px' }}>
              <a href="#how-it-works" className="nav-link-item">How It Works</a>
              <a href="#features" className="nav-link-item">Features</a>
              <a href="#about" className="nav-link-item">About</a>
            </nav>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          {/* Elderly Accessibility Font Size Switcher */}
          <div className="text-size-switch" title="Adjust text size for easier reading">
            <button
              onClick={() => setTextSize('normal')}
              className={`text-size-btn ${textSize === 'normal' ? 'active' : ''}`}
            >
              A
            </button>
            <button
              onClick={() => setTextSize('large')}
              className={`text-size-btn ${textSize === 'large' ? 'active' : ''}`}
            >
              A+
            </button>
            <button
              onClick={() => setTextSize('xlarge')}
              className={`text-size-btn ${textSize === 'xlarge' ? 'active' : ''}`}
            >
              A++
            </button>
          </div>

          {isAuthenticated ? (
            <div className="top-navbar-user">
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                <div className="user-avatar-badge">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>
                    {user?.name || 'My Account'}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    {user?.email}
                  </span>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ padding: '8px 14px', fontSize: '0.9rem' }}
                title="Log out"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '8px 20px', fontSize: '0.95rem' }}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.95rem' }}>
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
