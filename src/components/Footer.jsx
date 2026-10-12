import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, ShieldAlert } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="landing-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: '#0f62fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <HeartPulse size={22} />
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ffffff' }}>MediExplain</span>
            </div>
            <p className="footer-subtitle">
              Helping elderly and non-technical users understand medical reports, laboratory test results, and prescriptions in simple, accessible language.
            </p>
          </div>

          <div>
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links-list">
              <li><Link to="/">Home</Link></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Create Account</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Important Healthcare Note</h4>
            <div style={{
              background: '#1e293b',
              borderLeft: '4px solid #0f62fe',
              padding: '16px',
              borderRadius: '8px',
              fontSize: '0.95rem',
              lineHeight: '1.6',
              color: '#cbd5e1'
            }}>
              This application is an educational reading aid and does NOT provide medical diagnosis or replace consultation with a qualified doctor. Always discuss your test results directly with your physician.
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 MediExplain. Built for clarity, accessibility, and peace of mind.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
