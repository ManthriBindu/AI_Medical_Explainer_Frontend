import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, Calendar, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatDate } from '../utils/formatters';

const ReportCard = ({ report, onDelete }) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: '#eff6ff',
            color: '#0f62fe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FileText size={26} />
          </div>
          <StatusBadge status={report.status || 'Reviewed'} />
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
          {report.fileName || 'Medical Report'}
        </h3>
        <p style={{ fontSize: '0.95rem', color: '#0f62fe', fontWeight: '700', marginBottom: '12px' }}>
          {report.reportType || 'General Lab Report'}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.95rem' }}>
          <Calendar size={16} />
          <span>Uploaded: <strong>{formatDate(report.uploadDate)}</strong></span>
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '22px',
        paddingTop: '16px',
        borderTop: '1px solid #e2e8f0'
      }}>
        <Link
          to={`/reports/${report.id}`}
          className="btn btn-outline"
          style={{ padding: '8px 18px', fontSize: '0.95rem', gap: '6px' }}
        >
          <span>View Report</span>
          <ArrowRight size={16} />
        </Link>

        {onDelete && (
          <button
            onClick={() => onDelete(report.id)}
            style={{
              color: '#94a3b8',
              padding: '8px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#dc2626'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
            title="Delete report"
            aria-label="Delete report"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ReportCard;
