import React from 'react';
import { Pill, Clock, Utensils, Edit3, Trash2, Calendar } from 'lucide-react';
import { formatDate } from '../utils/formatters';

const MedicineCard = ({ medicine, onEdit, onDelete }) => {
  return (
    <div className="medicine-card">
      <div>
        <div className="medicine-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#eff6ff',
              color: '#0f62fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Pill size={22} />
            </div>
            <div>
              <h3 className="medicine-name">{medicine.medicineName}</h3>
              <span className="medicine-dosage-badge">{medicine.dosage}</span>
            </div>
          </div>
        </div>

        <div className="medicine-details">
          <div className="medicine-detail-row">
            <Clock size={18} style={{ color: '#0f62fe' }} />
            <span>Frequency: <strong>{medicine.frequency}</strong></span>
          </div>

          <div className="medicine-detail-row">
            <Utensils size={18} style={{ color: '#059669' }} />
            <span>Instructions: <strong>{medicine.foodInstruction || 'After Food'}</strong></span>
          </div>

          {medicine.nextReminder && (
            <div className="medicine-detail-row">
              <Clock size={18} style={{ color: '#d97706' }} />
              <span>Next Timing: <strong>{medicine.nextReminder}</strong></span>
            </div>
          )}

          {medicine.notes && (
            <p style={{
              marginTop: '8px',
              fontSize: '0.95rem',
              color: '#64748b',
              backgroundColor: '#f8fafc',
              padding: '8px 12px',
              borderRadius: '8px',
              borderLeft: '3px solid #cbd5e1'
            }}>
              {medicine.notes}
            </p>
          )}
        </div>
      </div>

      <div className="medicine-actions">
        {onEdit && (
          <button
            onClick={() => onEdit(medicine)}
            className="btn btn-secondary"
            style={{ flex: 1, padding: '8px 14px', fontSize: '0.95rem' }}
          >
            <Edit3 size={16} />
            <span>Edit</span>
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(medicine.id)}
            className="btn btn-outline"
            style={{
              padding: '8px 14px',
              fontSize: '0.95rem',
              borderColor: '#fecaca',
              color: '#dc2626'
            }}
            title="Delete medicine"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default MedicineCard;
