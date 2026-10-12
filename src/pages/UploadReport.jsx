import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  FileCheck,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import ErrorMessage from '../components/ErrorMessage';
import reportService from '../services/reportService';

const UploadReport = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [reportType, setReportType] = useState('General Report');
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progressStep, setProgressStep] = useState(0); // 1 to 4
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file) => {
    setError('');
    const validExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'webp'];
    const ext = file.name.split('.').pop().toLowerCase();

    if (!validExtensions.includes(ext)) {
      setError('The file could not be processed. Please upload a valid PDF or image (JPG, PNG, JPEG).');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setError('File size exceeds the 25MB limit. Please upload a smaller file.');
      return;
    }

    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUseSample = (type) => {
    // Create a mock blob file for immediate demonstration
    let filename = 'Sample_Blood_Test_Report.pdf';
    let sampleContent = 'COMPLETE BLOOD COUNT AND METABOLIC PANEL';
    if (type === 'prescription') {
      filename = 'Sample_Doctor_Prescription.pdf';
      sampleContent = 'DOCTOR PRESCRIPTION SLIP';
    } else if (type === 'lipid') {
      filename = 'Sample_Lipid_Profile.pdf';
      sampleContent = 'LIPID PROFILE ASSESSMENT';
    }

    const blob = new Blob([sampleContent], { type: 'application/pdf' });
    const file = new File([blob], filename, { type: 'application/pdf' });
    setSelectedFile(file);
    setReportType(type === 'prescription' ? 'Prescription' : 'Blood Test');
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please choose or drop a medical report file first.');
      return;
    }

    try {
      setUploading(true);
      setError('');

      // Step 1: Uploading report
      setProgressStep(1);
      await new Promise((r) => setTimeout(r, 600));

      // Step 2: Extracting information
      setProgressStep(2);
      await new Promise((r) => setTimeout(r, 700));

      // Step 3: Understanding report
      setProgressStep(3);

      const response = await reportService.uploadReport(selectedFile, reportType);

      // Step 4: Preparing explanation
      setProgressStep(4);
      await new Promise((r) => setTimeout(r, 600));

      // Redirect to report details
      navigate(`/reports/${response.id}`);
    } catch (err) {
      console.error('Upload error:', err);
      const msg = err.response?.data?.message || 'The file could not be processed. Please upload a valid PDF or image.';
      setError(msg);
      setUploading(false);
      setProgressStep(0);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 KB';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <DashboardLayout>
      <div className="upload-dropzone-container">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
            Upload Medical Report
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#475569' }}>
            Upload a PDF or image of your medical report or prescription.
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        {/* Quick Sample Selector for Elderly & Easy Demo */}
        <div style={{
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '14px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e40af', fontWeight: '700' }}>
            <Sparkles size={20} />
            <span>Need a sample to test?</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleUseSample('blood')}
              className="btn btn-secondary"
              style={{ padding: '6px 14px', fontSize: '0.85rem' }}
              disabled={uploading}
            >
              Sample Blood Test
            </button>
            <button
              onClick={() => handleUseSample('prescription')}
              className="btn btn-secondary"
              style={{ padding: '6px 14px', fontSize: '0.85rem' }}
              disabled={uploading}
            >
              Sample Prescription
            </button>
          </div>
        </div>

        {/* Upload Dropzone */}
        {!uploading && (
          <div
            className={`upload-dropzone ${dragActive ? 'dragging' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              onChange={handleFileInput}
              style={{ display: 'none' }}
            />

            <div className="dropzone-icon">
              <Upload size={38} />
            </div>

            <h3 className="dropzone-title">
              Drag & Drop your file here
            </h3>
            <p className="dropzone-sub">
              or
            </p>

            <button
              type="button"
              className="btn btn-primary btn-large"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Choose File
            </button>

            <div style={{ marginTop: '24px', color: '#64748b', fontSize: '0.95rem' }}>
              <strong>Supported formats:</strong> PDF, JPG, JPEG, PNG (Up to 25MB)
            </div>
          </div>
        )}

        {/* Selected File Details */}
        {selectedFile && !uploading && (
          <div className="file-selected-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                backgroundColor: '#eff6ff',
                color: '#0f62fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FileCheck size={28} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>
                  {selectedFile.name}
                </h4>
                <p style={{ fontSize: '0.95rem', color: '#64748b' }}>
                  {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Document'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={handleRemoveFile}
                className="btn btn-secondary"
                style={{ padding: '8px 14px', fontSize: '0.95rem' }}
                title="Remove file"
              >
                <X size={18} />
                <span>Remove</span>
              </button>

              <button
                onClick={handleUpload}
                className="btn btn-primary btn-large"
              >
                <Upload size={20} />
                <span>Upload & Explain</span>
              </button>
            </div>
          </div>
        )}

        {/* Upload Progress Tracker */}
        {uploading && (
          <div className="progress-container">
            <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
              {progressStep === 1 && 'Uploading report...'}
              {progressStep === 2 && 'Extracting information...'}
              {progressStep === 3 && 'Understanding your report...'}
              {progressStep === 4 && 'Preparing your explanation...'}
            </h3>
            <p style={{ fontSize: '1.1rem', color: '#475569' }}>
              Please wait a moment while our system analyzes your medical values.
            </p>

            <div className="progress-steps-list">
              <div className={`progress-step-item ${progressStep >= 1 ? 'active' : ''} ${progressStep > 1 ? 'completed' : ''}`}>
                <div className="progress-step-circle">1</div>
                <span className="progress-step-label">Uploading</span>
              </div>

              <div className={`progress-step-item ${progressStep >= 2 ? 'active' : ''} ${progressStep > 2 ? 'completed' : ''}`}>
                <div className="progress-step-circle">2</div>
                <span className="progress-step-label">Extracting</span>
              </div>

              <div className={`progress-step-item ${progressStep >= 3 ? 'active' : ''} ${progressStep > 3 ? 'completed' : ''}`}>
                <div className="progress-step-circle">3</div>
                <span className="progress-step-label">Analyzing</span>
              </div>

              <div className={`progress-step-item ${progressStep >= 4 ? 'active' : ''}`}>
                <div className="progress-step-circle">4</div>
                <span className="progress-step-label">Explaining</span>
              </div>
            </div>

            <div style={{ marginTop: '28px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '4px solid #e0edff',
                borderTop: '4px solid #0f62fe',
                borderRadius: '50%',
                margin: '0 auto',
                animation: 'spin 1s linear infinite'
              }} />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UploadReport;
