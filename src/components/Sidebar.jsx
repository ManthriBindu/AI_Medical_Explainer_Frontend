import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Upload,
  Pill,
  CalendarClock,
  ShieldAlert,
  User,
  LogOut,
  HeartPulse,
  X
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

const Sidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Reports', path: '/reports', icon: FileText },
    { name: 'Upload Report', path: '/upload', icon: Upload },
    { name: 'Medicines', path: '/medicines', icon: Pill },
    { name: 'Medication Schedule', path: '/schedule', icon: CalendarClock },
    { name: 'Drug Interactions', path: '/interactions', icon: ShieldAlert },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <NavLink to="/dashboard" className="brand-link" onClick={onClose}>
            <div className="brand-icon">
              <HeartPulse size={24} />
            </div>
            <span>MediExplain</span>
          </NavLink>

          <button
            onClick={onClose}
            style={{ display: 'none', color: '#64748b' }}
            className="mobile-close-btn"
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Icon size={22} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button
            onClick={handleLogout}
            className="sidebar-link"
            style={{ width: '100%', color: '#dc2626' }}
          >
            <LogOut size={22} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
