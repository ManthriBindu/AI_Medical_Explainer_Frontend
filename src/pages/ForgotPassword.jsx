import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, ArrowLeft, CheckCircle2, HeartPulse } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      <Navbar isDashboard={false} />

      <main className="auth-page-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo-badge">
              <HeartPulse size={32} />
            </div>
            <h1 className="auth-title">Reset Password</h1>
            <p className="auth-subtitle">We will send you instructions to safely reset your password</p>
          </div>

          {submitted ? (
            <div style={{
              backgroundColor: '#ecfdf5',
              border: '2px solid #a7f3d0',
              borderRadius: '14px',
              padding: '24px',
              textAlign: 'center'
            }}>
              <CheckCircle2 size={44} style={{ color: '#059669', marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.25rem', color: '#065f46', marginBottom: '8px' }}>
                Instructions Sent!
              </h3>
              <p style={{ color: '#047857', fontSize: '1rem', lineHeight: '1.6' }}>
                If an account exists for <strong>{email}</strong>, you will receive password reset instructions shortly.
              </p>
              <div style={{ marginTop: '24px' }}>
                <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>
                  Back to Login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="reset-email" className="form-label">
                  Registered Email Address
                </label>
                <input
                  id="reset-email"
                  type="email"
                  className="form-input"
                  placeholder="e.g. yourname@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-large" style={{ width: '100%', marginTop: '8px' }}>
                <KeyRound size={20} />
                <span>Send Reset Link</span>
              </button>
            </form>
          )}

          <div className="auth-footer-links">
            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <ArrowLeft size={16} />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ForgotPassword;
