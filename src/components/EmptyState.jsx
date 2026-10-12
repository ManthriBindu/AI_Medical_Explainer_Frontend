import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';

const EmptyState = ({
  icon: Icon = FileQuestion,
  title = 'No items found',
  description = 'There are no records to display at this time.',
  actionText,
  actionLink,
  onAction
}) => {
  return (
    <div style={{
      background: '#ffffff',
      border: '2px dashed #cbd5e1',
      borderRadius: '20px',
      padding: '54px 32px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '24px 0'
    }}>
      <div style={{
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        backgroundColor: '#eff6ff',
        color: '#0f62fe',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px'
      }}>
        <Icon size={36} />
      </div>
      <h3 style={{
        fontSize: '1.45rem',
        fontWeight: '800',
        color: '#0f172a',
        marginBottom: '10px'
      }}>
        {title}
      </h3>
      <p style={{
        fontSize: '1.1rem',
        color: '#475569',
        maxWidth: '460px',
        marginBottom: actionText ? '24px' : '0'
      }}>
        {description}
      </p>

      {actionText && actionLink && (
        <Link to={actionLink} className="btn btn-primary btn-large">
          {actionText}
        </Link>
      )}

      {actionText && onAction && (
        <button onClick={onAction} className="btn btn-primary btn-large">
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
