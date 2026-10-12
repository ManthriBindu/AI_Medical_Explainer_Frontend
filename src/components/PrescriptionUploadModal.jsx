import React, { useState, useRef } from 'react';
import {
  Upload,
  FileCheck,
  X,
  Sparkles,
  Pill,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import PrescriptionReviewSection from './PrescriptionReviewSection';
import ErrorMessage from './ErrorMessage';
import medicineService from '../services/medicineService';

const PrescriptionUploadModal = ({ isOpen, onClose, onMedicinesSaved }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateFile(e.target.files[0]);
    }
  };

  const validateFile = (file) => {
    setError('');
    const ext = file.name.split('.').pop().toLowerCase();
    const allowed = ['pdf', 'png', 'jpg', 'jpeg', 'webp', 'txt'];
    if (!allowed.includes(ext)) {
      setError('Please upload a valid prescription document (PDF, PNG, JPG, JPEG).');
      return;
    }
    setSelectedFile(file);
    setExtractedData(null);
  };

  const handleUseSample = () => {
    const sampleText = `DOCTOR'S PRESCRIPTION SLIP
Clinic: Metro Health Family Practice
Doctor: Dr. Sarah Jenkins, MD
Date: 08 Oct 2026
Patient: Bindu Sree (Age 58)

Rx (Prescribed Medicines):
1. Metformin 500 mg - 1 tablet twice daily after meals (Breakfast and Dinner).
2. Atorvastatin 10 mg - 1 tablet once daily at bedtime.
3. Vitamin D3 1000 IU - 1 capsule once daily in the morning with food.

Special Instructions:
Take medicines on time with plenty of water.`;

    const blob = new Blob([sampleText], { type: 'text/plain' });
    const file = new File([blob], 'Sample_Doctor_Prescription.txt', { type: 'text/plain' });
    setSelectedFile(file);
    setExtractedData(null);
  };

  const handleExtract = async () => {
    if (!selectedFile) {
      setError('Please select or drop a prescription file first.');
      return;
    }

    try {
      setExtracting(true);
      setError('');
      const data = await medicineService.extractPrescription(selectedFile);
      setExtractedData(data);
    } catch (err) {
      console.error('Prescription extraction error:', err);
      setError(err.response?.data?.message || 'Could not extract medicines from the uploaded prescription. Please try again.');
    } finally {
      setExtracting(false);
    }
  };

  const handleConfirmSuccess = (savedList) => {
    if (onMedicinesSaved) {
      onMedicinesSaved(savedList);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content"
        style={{ maxWidth: '840px', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: '#eff6ff',
              color: '#0f62fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Pill size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0f172a' }}>
                Auto-Extract Medicines From Prescription
              </h2>
              <p style={{ fontSize: '0.95rem', color: '#64748b' }}>
                Upload your doctor's prescription to automatically detect medicine names, dosages, and schedules.
              </p>
            </div>
          </div>

          <button onClick={onClose} style={{ color: '#64748b' }} aria-label="Close modal">
            <X size={24} />
          </button>
        </div>

        {error && <ErrorMessage message={error} />}

        {/* Step 1: File Upload / Sample Selector if not yet extracted */}
        {!extractedData && (
          <div>
            {/* Quick Demo Sample Button */}
            <div style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '12px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e40af', fontWeight: '700', fontSize: '0.95rem' }}>
                <Sparkles size={18} />
                <span>Want to test automatic extraction instantly?</span>
              </div>
              <button
                type="button"
                onClick={handleUseSample}
                className="btn btn-secondary"
                style={{ padding: '6px 14px', fontSize: '0.85rem' }}
              >
                Use Sample Prescription
              </button>
            </div>

            {/* Dropzone */}
            <div
              className="upload-dropzone"
              style={{ padding: '36px 20px' }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.webp,.txt"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />

              <div className="dropzone-icon" style={{ width: '56px', height: '56px', marginBottom: '14px' }}>
                <Upload size={28} />
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                {selectedFile ? selectedFile.name : 'Choose or drop prescription slip here'}
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#64748b' }}>
                Supports PDF, JPG, PNG, or photo slip
              </p>
            </div>

            {/* Selected File action */}
            {selectedFile && (
              <div style={{
                marginTop: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#f8fafc',
                padding: '14px 18px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileCheck size={22} style={{ color: '#059669' }} />
                  <span style={{ fontWeight: '700', color: '#0f172a' }}>{selectedFile.name}</span>
                </div>

                <button
                  type="button"
                  onClick={handleExtract}
                  className="btn btn-primary"
                  disabled={extracting}
                >
                  <Pill size={18} />
                  <span>{extracting ? 'Extracting Medicines...' : 'Extract Medicines'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Review Screen (Requirement 4 & 5) */}
        {extractedData && (
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px',
              backgroundColor: '#f0fdf4',
              padding: '12px 16px',
              borderRadius: '10px',
              border: '1px solid #bbf7d0'
            }}>
              <span style={{ color: '#166534', fontWeight: '700', fontSize: '0.95rem' }}>
                ✓ Document: {extractedData.fileName}
              </span>
              <button
                type="button"
                onClick={() => {
                  setExtractedData(null);
                  setSelectedFile(null);
                }}
                className="btn btn-secondary"
                style={{ padding: '4px 10px', fontSize: '0.8rem', minHeight: '30px' }}
              >
                Upload Different Slip
              </button>
            </div>

            <PrescriptionReviewSection
              extractedMedicines={extractedData.extractedMedicines}
              prescriptionNotice={extractedData.prescriptionNotice}
              onConfirmSuccess={handleConfirmSuccess}
              onCancel={onClose}
              showCancelButton={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionUploadModal;
