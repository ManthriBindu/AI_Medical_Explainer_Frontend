import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Pill, ArrowLeft, Save, Plus, X, CheckCircle2, FileText, Sparkles } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import ErrorMessage from '../components/ErrorMessage';
import PrescriptionUploadModal from '../components/PrescriptionUploadModal';
import medicineService from '../services/medicineService';
import { validateMedicineForm } from '../utils/validators';

const AddMedicine = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editingMedicine = location.state?.medicine;
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

  const [formData, setFormData] = useState({
    medicineName: '',
    dosage: '',
    frequency: 'Once daily',
    foodInstruction: 'After Food',
    startDate: '',
    endDate: '',
    notes: '',
  });

  const [reminderTimes, setReminderTimes] = useState(['08:00 AM']);
  const [newTimeInput, setNewTimeInput] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (editingMedicine) {
      setFormData({
        medicineName: editingMedicine.medicineName || '',
        dosage: editingMedicine.dosage || '',
        frequency: editingMedicine.frequency || 'Once daily',
        foodInstruction: editingMedicine.foodInstruction || 'After Food',
        startDate: editingMedicine.startDate || '',
        endDate: editingMedicine.endDate || '',
        notes: editingMedicine.notes || '',
      });

      if (editingMedicine.reminders && editingMedicine.reminders.length > 0) {
        setReminderTimes(editingMedicine.reminders.map((r) => r.reminderTime));
      }
    }
  }, [editingMedicine]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddTime = () => {
    if (newTimeInput.trim() && !reminderTimes.includes(newTimeInput.trim())) {
      setReminderTimes([...reminderTimes, newTimeInput.trim()]);
      setNewTimeInput('');
    }
  };

  const handleRemoveTime = (time) => {
    setReminderTimes(reminderTimes.filter((t) => t !== time));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateMedicineForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        reminderTimes: reminderTimes.length > 0 ? reminderTimes : ['08:00 AM'],
      };

      if (editingMedicine) {
        await medicineService.updateMedicine(editingMedicine.id, payload);
        setSuccessMessage('Medicine updated successfully!');
      } else {
        await medicineService.createMedicine(payload);
        setSuccessMessage('Medicine saved successfully!');
      }

      setTimeout(() => {
        navigate('/medicines');
      }, 1000);
    } catch (err) {
      console.error('Failed to save medicine:', err);
      setErrors({ form: err.response?.data?.message || 'Could not save medicine. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <div style={{ marginBottom: '20px' }}>
          <Link to="/medicines" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#475569' }}>
            <ArrowLeft size={18} />
            <span>Back to Medicines</span>
          </Link>
        </div>

        {!editingMedicine && (
          <div style={{
            background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)',
            border: '2px solid #bfdbfe',
            borderRadius: '16px',
            padding: '20px 24px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#0f62fe',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Sparkles size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>
                  Avoid Typing Manually!
                </h3>
                <p style={{ fontSize: '0.95rem', color: '#475569', marginTop: '2px' }}>
                  Upload a photo or PDF of your doctor's prescription to automatically extract and schedule medicines.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowPrescriptionModal(true)}
              className="btn btn-primary"
              style={{ whiteSpace: 'nowrap' }}
            >
              <FileText size={18} />
              <span>Auto-Extract from Prescription</span>
            </button>
          </div>
        )}

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              backgroundColor: '#eff6ff',
              color: '#0f62fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Pill size={28} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a' }}>
                {editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}
              </h1>
              <p style={{ fontSize: '1.05rem', color: '#64748b' }}>
                Fill in the details prescribed by your doctor.
              </p>
            </div>
          </div>

          {successMessage && (
            <div style={{
              backgroundColor: '#ecfdf5',
              border: '2px solid #a7f3d0',
              borderRadius: '12px',
              padding: '16px 20px',
              color: '#065f46',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px',
              fontWeight: '700'
            }}>
              <CheckCircle2 size={22} style={{ color: '#059669' }} />
              <span>{successMessage}</span>
            </div>
          )}

          {errors.form && <ErrorMessage message={errors.form} />}

          <form onSubmit={handleSubmit}>
            {/* Medicine Name */}
            <div className="form-group">
              <label htmlFor="medicineName" className="form-label">
                Medicine Name *
              </label>
              <input
                id="medicineName"
                name="medicineName"
                type="text"
                className="form-input"
                placeholder="e.g. Metformin, Aspirin, Atorvastatin"
                value={formData.medicineName}
                onChange={handleChange}
                required
              />
              {errors.medicineName && <span className="form-error">{errors.medicineName}</span>}
            </div>

            {/* Dosage & Frequency Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label htmlFor="dosage" className="form-label">
                  Dosage *
                </label>
                <input
                  id="dosage"
                  name="dosage"
                  type="text"
                  className="form-input"
                  placeholder="e.g. 500 mg, 1 tablet"
                  value={formData.dosage}
                  onChange={handleChange}
                  required
                />
                {errors.dosage && <span className="form-error">{errors.dosage}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="frequency" className="form-label">
                  Frequency *
                </label>
                <select
                  id="frequency"
                  name="frequency"
                  className="form-select"
                  value={formData.frequency}
                  onChange={handleChange}
                >
                  <option value="Once daily">Once daily</option>
                  <option value="Twice daily">Twice daily</option>
                  <option value="Three times daily">Three times daily</option>
                  <option value="Every 8 hours">Every 8 hours</option>
                  <option value="As needed">As needed (SOS)</option>
                  <option value="Weekly once">Weekly once</option>
                </select>
              </div>
            </div>

            {/* Food Instruction */}
            <div className="form-group">
              <label htmlFor="foodInstruction" className="form-label">
                Meal / Food Instructions
              </label>
              <select
                id="foodInstruction"
                name="foodInstruction"
                className="form-select"
                value={formData.foodInstruction}
                onChange={handleChange}
              >
                <option value="After Food">After Food (Recommended for stomach comfort)</option>
                <option value="Before Food">Before Food (On empty stomach)</option>
                <option value="With Food">With Food</option>
                <option value="At Bedtime">At Bedtime</option>
                <option value="Anytime">Anytime</option>
              </select>
            </div>

            {/* Reminder Times */}
            <div className="form-group">
              <label className="form-label">
                Daily Reminder Timings
              </label>
              <p className="form-hint" style={{ marginBottom: '10px' }}>
                These times will appear on your daily medication schedule.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                {reminderTimes.map((time) => (
                  <span
                    key={time}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: '#eff6ff',
                      color: '#0f62fe',
                      padding: '8px 14px',
                      borderRadius: '9999px',
                      fontWeight: '700',
                      border: '1px solid #bfdbfe'
                    }}
                  >
                    <span>{time}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTime(time)}
                      style={{ color: '#0f62fe', display: 'flex' }}
                      aria-label={`Remove time ${time}`}
                    >
                      <X size={16} />
                    </button>
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '10px', maxWidth: '320px' }}>
                <input
                  type="text"
                  placeholder="e.g. 08:00 AM or 08:00 PM"
                  className="form-input"
                  value={newTimeInput}
                  onChange={(e) => setNewTimeInput(e.target.value)}
                  style={{ padding: '8px 14px' }}
                />
                <button
                  type="button"
                  onClick={handleAddTime}
                  className="btn btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.95rem' }}
                >
                  <Plus size={16} />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Start and End Date */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label htmlFor="startDate" className="form-label">
                  Start Date (Optional)
                </label>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  className="form-input"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="endDate" className="form-label">
                  End Date (Optional)
                </label>
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  className="form-input"
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Notes */}
            <div className="form-group">
              <label htmlFor="notes" className="form-label">
                Doctor's Special Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows="3"
                className="form-textarea"
                placeholder="e.g. Drink full glass of water, do not crush tablet, monitor blood sugar..."
                value={formData.notes}
                onChange={handleChange}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', marginTop: '32px' }}>
              <Link to="/medicines" className="btn btn-secondary">
                Cancel
              </Link>
              <button
                type="submit"
                className="btn btn-primary btn-large"
                disabled={loading}
              >
                <Save size={20} />
                <span>{loading ? 'Saving...' : 'Save Medicine'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Prescription Upload & Auto-Extract Modal (Requirement 2-8) */}
      <PrescriptionUploadModal
        isOpen={showPrescriptionModal}
        onClose={() => setShowPrescriptionModal(false)}
        onMedicinesSaved={() => {
          setShowPrescriptionModal(false);
          navigate('/medicines');
        }}
      />
    </DashboardLayout>
  );
};

export default AddMedicine;
