import React from 'react';
import { ShieldAlert } from 'lucide-react';

const MedicalDisclaimer = ({ compact = false }) => {
  return (
    <div className={`disclaimer-banner ${compact ? 'compact' : ''}`} role="note" aria-label="Medical Disclaimer">
      <ShieldAlert size={28} />
      <div className="disclaimer-text">
        <strong>Important Healthcare Notice</strong>
        This application provides general educational information to help you understand medical reports and prescriptions. 
        It does not provide medical diagnosis or replace professional medical advice. Always consult a qualified healthcare 
        professional for medical decisions.
      </div>
    </div>
  );
};

export default MedicalDisclaimer;
