import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      backgroundColor: '#f8fafc',
      textAlign: 'center'
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: '#eff6ff',
        color: '#0f62fe',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px'
      }}>
        <HelpCircle size={44} />
      </div>

      <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>
        Page Not Found
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#64748b', maxWidth: '480px', marginBottom: '32px' }}>
        The page you are looking for might have been moved, removed, or does not exist.
      </p>

      <Link to="/dashboard" className="btn btn-primary btn-large">
        <ArrowLeft size={20} />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};

export default NotFound;
