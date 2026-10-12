import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorMessage = ({ message, onRetry }) => {
  if (!message) return null;

  return (
    <div style={{
      backgroundColor: '#fef2f2',
      border: '2px solid #fecaca',
      borderRadius: '14px',
      padding: '18px 22px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      margin: '18px 0',
      color: '#991b1b'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <AlertCircle size={24} style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '1.05rem', fontWeight: '600' }}>{message}</span>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-secondary"
          style={{ padding: '8px 16px', fontSize: '0.95rem' }}
        >
          <RefreshCw size={16} />
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
