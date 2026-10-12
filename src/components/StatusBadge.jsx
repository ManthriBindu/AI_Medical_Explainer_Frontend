import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, HelpCircle } from 'lucide-react';
import { getStatusColorClass } from '../utils/formatters';

const StatusBadge = ({ status }) => {
  const colorClass = getStatusColorClass(status);
  const s = String(status || '').toLowerCase();

  let Icon = HelpCircle;
  if (s.includes('normal') || s.includes('reviewed') || s.includes('taken') || s.includes('safe')) {
    Icon = CheckCircle2;
  } else if (s.includes('attention') || s.includes('upcoming') || s.includes('borderline') || s.includes('moderate')) {
    Icon = AlertTriangle;
  } else if (s.includes('abnormal') || s.includes('missed') || s.includes('high') || s.includes('severe')) {
    Icon = AlertCircle;
  }

  return (
    <span className={`status-badge ${colorClass}`}>
      <Icon size={16} />
      <span>{status || 'Unknown'}</span>
    </span>
  );
};

export default StatusBadge;
