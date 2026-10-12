import React from 'react';
import { Check, X, Clock, Pill } from 'lucide-react';
import StatusBadge from './StatusBadge';

const ReminderCard = ({ reminder, onUpdateStatus }) => {
  const isTaken = reminder.status === 'Taken';
  const isSkipped = reminder.status === 'Skipped';

  return (
    <div className={`schedule-card ${isTaken ? 'taken' : ''} ${isSkipped ? 'missed' : ''}`}>
      <div className="schedule-time-box">
        <div className="schedule-clock-badge">
          <Clock size={20} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-3px', color: '#0f62fe' }} />
          {reminder.reminderTime}
        </div>

        <div className="schedule-med-info">
          <h4>{reminder.medicineName}</h4>
          <p>
            <strong>{reminder.dosage}</strong> • {reminder.foodInstruction || 'After Food'}
          </p>
        </div>
      </div>

      <div className="schedule-action-group">
        <StatusBadge status={reminder.status || 'Upcoming'} />

        {!isTaken && onUpdateStatus && (
          <button
            onClick={() => onUpdateStatus(reminder.id, 'Taken')}
            className="btn btn-success"
            style={{ padding: '8px 16px', fontSize: '0.95rem' }}
          >
            <Check size={18} />
            <span>Mark as Taken</span>
          </button>
        )}

        {isTaken && onUpdateStatus && (
          <button
            onClick={() => onUpdateStatus(reminder.id, 'Upcoming')}
            className="btn btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
          >
            Reset
          </button>
        )}

        {!isTaken && !isSkipped && onUpdateStatus && (
          <button
            onClick={() => onUpdateStatus(reminder.id, 'Skipped')}
            className="btn btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.9rem', color: '#64748b' }}
          >
            <X size={16} />
            <span>Skip</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ReminderCard;
