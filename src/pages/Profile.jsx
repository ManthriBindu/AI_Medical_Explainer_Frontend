import React, { useState } from 'react';
import { User, Mail, Shield, LogOut, CheckCircle2 } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import useAuth from '../hooks/useAuth';

const Profile = () => {
  const { user, logout, textSize, setTextSize } = useAuth();
  const [success, setSuccess] = useState('');

  const handleUpdatePreference = (size) => {
    setTextSize(size);
    setSuccess('Accessibility reading preference updated!');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
          My Profile & Settings
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#475569', marginBottom: '28px' }}>
          Manage your account information and visual accessibility preferences.
        </p>

        {success && (
          <div style={{
            backgroundColor: '#ecfdf5',
            border: '2px solid #a7f3d0',
            borderRadius: '12px',
            padding: '14px 18px',
            color: '#065f46',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '24px',
            fontWeight: '700'
          }}>
            <CheckCircle2 size={20} style={{ color: '#059669' }} />
            <span>{success}</span>
          </div>
        )}

        {/* Profile Details Card */}
        <div className="card" style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '24px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#eff6ff',
              color: '#0f62fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
              fontWeight: '800'
            }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>
                {user?.name || 'Registered User'}
              </h2>
              <span style={{ fontSize: '1rem', color: '#64748b' }}>
                {user?.email}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 18px',
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}>
              <User size={20} style={{ color: '#0f62fe' }} />
              <div>
                <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block' }}>Full Name</span>
                <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>{user?.name}</strong>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 18px',
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}>
              <Mail size={20} style={{ color: '#0f62fe' }} />
              <div>
                <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block' }}>Email Address</span>
                <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>{user?.email}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Accessibility Preferences Card */}
        <div className="card" style={{ marginBottom: '28px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
            Accessibility & Text Size
          </h3>
          <p style={{ fontSize: '1.05rem', color: '#475569', marginBottom: '20px' }}>
            Choose the reading font size that feels most comfortable for you across the entire application:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
            <button
              onClick={() => handleUpdatePreference('normal')}
              className={`btn ${textSize === 'normal' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ justifyContent: 'center' }}
            >
              Standard Size (A)
            </button>
            <button
              onClick={() => handleUpdatePreference('large')}
              className={`btn ${textSize === 'large' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ justifyContent: 'center' }}
            >
              Large Text (A+)
            </button>
            <button
              onClick={() => handleUpdatePreference('xlarge')}
              className={`btn ${textSize === 'xlarge' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ justifyContent: 'center' }}
            >
              Extra Large (A++)
            </button>
          </div>
        </div>

        {/* Account Actions */}
        <div className="card">
          <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', marginBottom: '14px' }}>
            Security & Session
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '1.05rem', color: '#475569' }}>
                Securely sign out of this device.
              </p>
            </div>
            <button
              onClick={logout}
              className="btn btn-secondary"
              style={{ color: '#dc2626', borderColor: '#fecaca' }}
            >
              <LogOut size={18} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
