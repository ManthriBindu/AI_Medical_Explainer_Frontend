import React from 'react';

const LoadingSpinner = ({ text = 'Loading...', fullScreen = false }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: fullScreen ? '100px 20px' : '40px 20px',
      gap: '16px',
      width: '100%'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '4px solid #e0edff',
        borderTop: '4px solid #0f62fe',
        borderRadius: '50%',
        animation: 'spin 0.9s linear infinite'
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <p style={{
        fontSize: '1.1rem',
        fontWeight: '700',
        color: '#475569'
      }}>
        {text}
      </p>
    </div>
  );
};

export default LoadingSpinner;
