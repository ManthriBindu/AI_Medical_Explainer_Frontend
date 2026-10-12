import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Pill,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  Trash2,
  Save,
  ArrowRight,
  Info,
  CalendarCheck,
  X
} from 'lucide-react';
import medicineService from '../services/medicineService';
import ErrorMessage from './ErrorMessage';

const PrescriptionReviewSection = ({
  extractedMedicines = [],
  prescriptionNotice = '',
  onConfirmSuccess,
  onCancel,
  showCancelButton = false
}) => {
  const [medicines, setMedicines] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    if (extractedMedicines && extractedMedicines.length > 0) {
      setMedicines(
        extractedMedicines.map((m, idx) => ({
          id: idx + 1,
          selected: true,
          medicineName: m.medicineName || '',
          dosage: m.dosage || '',
          frequency: m.frequency || 'Once daily',
          foodInstruction: m.foodInstruction || 'After Food',
          duration: m.duration || '',
          reminderTimes: m.reminderTimes && m.reminderTimes.length > 0 ? [...m.reminderTimes] : ['08:00 AM'],
          notes: m.notes || '',
          needsConfirmation: !!m.needsConfirmation,
          confirmationReason: m.confirmationReason || ''
        }))
      );
    } else {
      setMedicines([]);
    }
    setSavedSuccess(false);
  }, [extractedMedicines]);

  const handleFieldChange = (id, field, value) => {
    setMedicines((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          // If user filled in dosage/frequency, clear needsConfirmation if both are present
          if (field === 'dosage' && value.trim() && item.frequency && !item.frequency.includes('unclear')) {
            updated.needsConfirmation = false;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const handleToggleSelect = (id) => {
    setMedicines((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  const handleRemoveMedicine = (id) => {
    setMedicines((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddCustomMedicine = () => {
    const newId = medicines.length > 0 ? Math.max(...medicines.map((m) => m.id)) + 1 : 1;
    setMedicines([
      ...medicines,
      {
        id: newId,
        selected: true,
        medicineName: '',
        dosage: '',
        frequency: 'Once daily',
        foodInstruction: 'After Food',
        duration: '',
        reminderTimes: ['08:00 AM'],
        notes: '',
        needsConfirmation: false,
        confirmationReason: ''
      }
    ]);
  };

  const handleAddTime = (id, newTime) => {
    if (!newTime || !newTime.trim()) return;
    setMedicines((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (!item.reminderTimes.includes(newTime.trim())) {
            return { ...item, reminderTimes: [...item.reminderTimes, newTime.trim()] };
          }
        }
        return item;
      })
    );
  };

  const handleRemoveTime = (id, timeToRemove) => {
    setMedicines((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            reminderTimes: item.reminderTimes.filter((t) => t !== timeToRemove)
          };
        }
        return item;
      })
    );
  };

  const handleConfirmAndSave = async () => {
    setError('');
    const selectedList = medicines.filter((m) => m.selected);

    if (selectedList.length === 0) {
      setError('Please select at least one medicine to confirm and save.');
      return;
    }

    // Check that every selected medicine has a name
    for (const med of selectedList) {
      if (!med.medicineName || !med.medicineName.trim()) {
        setError('Please provide a name for all selected medicines.');
        return;
      }
    }

    try {
      setSaving(true);
      const payload = selectedList.map((m) => ({
        medicineName: m.medicineName.trim(),
        dosage: m.dosage && m.dosage.trim() ? m.dosage.trim() : 'As prescribed',
        frequency: m.frequency || 'Once daily',
        foodInstruction: m.foodInstruction || 'After Food',
        reminderTimes: m.reminderTimes && m.reminderTimes.length > 0 ? m.reminderTimes : ['08:00 AM'],
        notes: m.notes ? m.notes.trim() : (m.duration ? `Duration: ${m.duration}` : '')
      }));

      const savedResult = await medicineService.createMedicinesBatch(payload);
      setSavedCount(savedResult.length);
      setSavedSuccess(true);

      if (onConfirmSuccess) {
        onConfirmSuccess(savedResult);
      }
    } catch (err) {
      console.error('Failed to batch save medicines:', err);
      setError(err.response?.data?.message || 'Failed to save confirmed medicines. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (savedSuccess) {
    return (
      <div style={{
        backgroundColor: '#ecfdf5',
        border: '2px solid #a7f3d0',
        borderRadius: '16px',
        padding: '32px',
        margin: '24px 0',
        boxShadow: '0 4px 16px rgba(5, 150, 105, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#059669',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <CheckCircle2 size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#065f46' }}>
              Medicines Confirmed & Saved Successfully!
            </h3>
            <p style={{ fontSize: '1.1rem', color: '#047857', marginTop: '4px' }}>
              {savedCount} prescription medication{savedCount !== 1 ? 's have' : ' has'} been added to your Medication Tracker and scheduled for daily reminders.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '14px', marginTop: '24px', flexWrap: 'wrap' }}>
          <Link to="/medicines" className="btn btn-primary btn-large">
            <Pill size={20} />
            <span>View My Medicines</span>
          </Link>
          <Link to="/schedule" className="btn btn-secondary btn-large">
            <CalendarCheck size={20} />
            <span>View Medication Schedule</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{
      border: '2px solid #93c5fd',
      backgroundColor: '#f8fbff',
      margin: '28px 0',
      padding: '32px',
      boxShadow: '0 6px 20px rgba(15, 98, 254, 0.08)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            backgroundColor: '#eff6ff',
            color: '#0f62fe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Pill size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#0f172a' }}>
              Prescription Medicines Review
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#475569', marginTop: '4px' }}>
              We automatically extracted these medicines from your prescription. Please review, adjust if needed, and confirm.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddCustomMedicine}
          className="btn btn-secondary"
          style={{ padding: '8px 16px', fontSize: '0.95rem' }}
        >
          <Plus size={18} />
          <span>+ Add Another Medicine</span>
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* No Medicines Fallback (Requirement 9) */}
      {medicines.length === 0 ? (
        <div style={{
          backgroundColor: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center',
          margin: '20px 0'
        }}>
          <AlertTriangle size={36} style={{ color: '#d97706', margin: '0 auto 12px auto' }} />
          <h4 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#92400e', marginBottom: '8px' }}>
            No Prescribed Medicines Identified
          </h4>
          <p style={{ fontSize: '1.05rem', color: '#78350f', maxWidth: '580px', margin: '0 auto 18px auto', lineHeight: 1.6 }}>
            {prescriptionNotice ||
              'No active medicine lines could be clearly recognized from this document. If your prescription is faint or handwritten, you can add your medicines manually.'}
          </p>
          <button
            type="button"
            onClick={handleAddCustomMedicine}
            className="btn btn-primary"
            style={{ margin: '0 auto' }}
          >
            <Plus size={18} />
            <span>Add Medicine Manually</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '16px' }}>
          {medicines.map((med, index) => (
            <div
              key={med.id}
              style={{
                backgroundColor: '#ffffff',
                border: med.needsConfirmation ? '2px solid #f59e0b' : '1px solid #cbd5e1',
                borderRadius: '14px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
                position: 'relative'
              }}
            >
              {/* Top row: Checkbox, index badge, and remove button */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', userSelect: 'none' }}>
                  <input
                    type="checkbox"
                    checked={med.selected}
                    onChange={() => handleToggleSelect(med.id)}
                    style={{ width: '22px', height: '22px', accentColor: '#0f62fe', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>
                    Medicine #{index + 1}: {med.medicineName || 'Unnamed Medicine'}
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => handleRemoveMedicine(med.id)}
                  style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', fontWeight: '600' }}
                  title="Remove this item from confirmation"
                >
                  <Trash2 size={18} />
                  <span>Remove</span>
                </button>
              </div>

              {/* Attention banner if OCR was unclear or missing details (Requirement 10) */}
              {med.needsConfirmation && (
                <div style={{
                  backgroundColor: '#fffbeb',
                  border: '1px solid #fde68a',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  marginBottom: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#92400e',
                  fontSize: '0.95rem'
                }}>
                  <AlertTriangle size={20} style={{ flexShrink: 0, color: '#d97706' }} />
                  <span>
                    <strong>Verification needed:</strong> {med.confirmationReason || 'Dosage or timings were unclear in prescription. Please confirm before saving.'}
                  </span>
                </div>
              )}

              {/* Form Grid for Review & Correction (Requirement 5 & 8) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                {/* Medicine Name */}
                <div>
                  <label className="form-label" style={{ fontSize: '0.95rem' }}>
                    Medicine Name *
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={med.medicineName}
                    onChange={(e) => handleFieldChange(med.id, 'medicineName', e.target.value)}
                    placeholder="e.g. Metformin"
                    required
                  />
                </div>

                {/* Dosage */}
                <div>
                  <label className="form-label" style={{ fontSize: '0.95rem' }}>
                    Strength / Dosage {med.needsConfirmation && <span style={{ color: '#d97706' }}>*</span>}
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ borderColor: med.needsConfirmation && !med.dosage ? '#f59e0b' : undefined }}
                    value={med.dosage}
                    onChange={(e) => handleFieldChange(med.id, 'dosage', e.target.value)}
                    placeholder="e.g. 500 mg, 1 tablet"
                  />
                </div>

                {/* Frequency */}
                <div>
                  <label className="form-label" style={{ fontSize: '0.95rem' }}>
                    Frequency
                  </label>
                  <select
                    className="form-select"
                    value={med.frequency}
                    onChange={(e) => {
                      const newFreq = e.target.value;
                      handleFieldChange(med.id, 'frequency', newFreq);
                      // Auto-update default timings if frequency changed
                      if (newFreq === 'Twice daily') {
                        handleFieldChange(med.id, 'reminderTimes', ['08:00 AM', '08:00 PM']);
                      } else if (newFreq === 'Three times daily') {
                        handleFieldChange(med.id, 'reminderTimes', ['08:00 AM', '01:00 PM', '08:00 PM']);
                      } else if (newFreq === 'Once daily') {
                        handleFieldChange(med.id, 'reminderTimes', ['08:00 AM']);
                      }
                    }}
                  >
                    <option value="Once daily">Once daily</option>
                    <option value="Twice daily">Twice daily</option>
                    <option value="Three times daily">Three times daily</option>
                    <option value="Four times daily">Four times daily</option>
                    <option value="As needed (SOS)">As needed (SOS)</option>
                    <option value="Weekly once">Weekly once</option>
                  </select>
                </div>

                {/* Food Instructions */}
                <div>
                  <label className="form-label" style={{ fontSize: '0.95rem' }}>
                    Food Instructions
                  </label>
                  <select
                    className="form-select"
                    value={med.foodInstruction}
                    onChange={(e) => handleFieldChange(med.id, 'foodInstruction', e.target.value)}
                  >
                    <option value="After Food">After Food (Standard with meals)</option>
                    <option value="Before Food">Before Food (On empty stomach)</option>
                    <option value="With Food">With Food</option>
                    <option value="At Bedtime">At Bedtime</option>
                    <option value="Anytime">Anytime</option>
                  </select>
                </div>
              </div>

              {/* Timing Pills & Notes Row */}
              <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                {/* Reminder Timings */}
                <div>
                  <label className="form-label" style={{ fontSize: '0.95rem' }}>
                    <Clock size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
                    Daily Schedule Timings
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                    {med.reminderTimes.map((time, tIdx) => (
                      <span
                        key={tIdx}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          backgroundColor: '#eff6ff',
                          color: '#0f62fe',
                          padding: '6px 12px',
                          borderRadius: '9999px',
                          fontWeight: '700',
                          fontSize: '0.9rem',
                          border: '1px solid #bfdbfe'
                        }}
                      >
                        <span>{time}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTime(med.id, time)}
                          style={{ color: '#0f62fe', display: 'flex' }}
                          aria-label={`Remove time ${time}`}
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}

                    {/* Quick Add Time */}
                    <div style={{ display: 'inline-flex', gap: '4px' }}>
                      <select
                        className="form-select"
                        style={{ padding: '4px 8px', fontSize: '0.85rem', width: 'auto' }}
                        onChange={(e) => {
                          if (e.target.value) {
                            handleAddTime(med.id, e.target.value);
                            e.target.value = '';
                          }
                        }}
                        defaultValue=""
                      >
                        <option value="" disabled>+ Add Time</option>
                        <option value="07:00 AM">07:00 AM</option>
                        <option value="08:00 AM">08:00 AM</option>
                        <option value="12:00 PM">12:00 PM</option>
                        <option value="01:00 PM">01:00 PM</option>
                        <option value="06:00 PM">06:00 PM</option>
                        <option value="08:00 PM">08:00 PM</option>
                        <option value="09:00 PM">09:00 PM</option>
                        <option value="10:00 PM">10:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Notes / Special Instructions */}
                <div>
                  <label className="form-label" style={{ fontSize: '0.95rem' }}>
                    Doctor Instructions / Notes
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={med.notes}
                    onChange={(e) => handleFieldChange(med.id, 'notes', e.target.value)}
                    placeholder="e.g. Take with water, finish full course..."
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Confirm & Save Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: '2px solid #e2e8f0',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ fontSize: '1rem', color: '#475569' }}>
              <strong>{medicines.filter((m) => m.selected).length}</strong> of {medicines.length} medicine(s) selected for confirmation.
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              {showCancelButton && onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="btn btn-secondary"
                  disabled={saving}
                >
                  Cancel
                </button>
              )}

              <button
                type="button"
                onClick={handleConfirmAndSave}
                className="btn btn-primary btn-large"
                disabled={saving || medicines.filter((m) => m.selected).length === 0}
              >
                <Save size={20} />
                <span>
                  {saving
                    ? 'Saving Confirmed Medicines...'
                    : `Confirm & Save to My Medicines (${medicines.filter((m) => m.selected).length})`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionReviewSection;
