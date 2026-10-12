import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Calendar,
  Download,
  ArrowLeft,
  Info,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Stethoscope,
  BookOpen
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmModal from '../components/ConfirmModal';
import PrescriptionReviewSection from '../components/PrescriptionReviewSection';
import reportService from '../services/reportService';
import { formatDate } from '../utils/formatters';

const ReportDetails = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showOriginalText, setShowOriginalText] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await reportService.getReportById(id);
      setReport(data);
    } catch (err) {
      console.error('Failed to load report:', err);
      setError('Report not found or unable to load details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await reportService.deleteReport(id);
      navigate('/reports');
    } catch (err) {
      console.error('Failed to delete report:', err);
      setError('Could not delete report.');
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner text="Loading report explanation..." />
      </DashboardLayout>
    );
  }

  if (error || !report) {
    return (
      <DashboardLayout>
        <ErrorMessage message={error || 'Report not found.'} />
        <Link to="/reports" className="btn btn-secondary">
          <ArrowLeft size={18} />
          <span>Back to All Reports</span>
        </Link>
      </DashboardLayout>
    );
  }

  const analysis = report.analysis || {};
  const testResults = analysis.testResults || [];
  const explanations = analysis.simpleExplanations || [];
  const doctorQuestions = analysis.questionsForDoctor || [];
  const abnormalValues = analysis.abnormalValues || [];
  const importantValues = analysis.importantValues || [];

  return (
    <DashboardLayout>
      {/* Back button and page title */}
      <div style={{ marginBottom: '20px' }}>
        <Link to="/reports" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#475569' }}>
          <ArrowLeft size={18} />
          <span>Back to Reports</span>
        </Link>
      </div>

      {/* Header Card */}
      <div className="report-details-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '14px',
            backgroundColor: '#eff6ff',
            color: '#0f62fe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FileText size={32} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.9rem', fontWeight: '800', color: '#0f172a' }}>
                {report.fileName}
              </h1>
              <StatusBadge status={report.status || 'Reviewed'} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginTop: '6px', color: '#64748b', fontSize: '1rem' }}>
              <span>Type: <strong>{report.reportType}</strong></span>
              <span>•</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={16} />
                <span>Uploaded: <strong>{formatDate(report.uploadDate)}</strong></span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setShowOriginalText(!showOriginalText)}
            className="btn btn-secondary"
          >
            <BookOpen size={18} />
            <span>{showOriginalText ? 'Hide Extracted Text' : 'View Extracted Text'}</span>
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="btn btn-outline"
            style={{ color: '#dc2626', borderColor: '#fecaca' }}
            title="Delete this report"
          >
            <Trash2 size={18} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Collapsible Extracted OCR Text view */}
      {showOriginalText && (
        <div style={{
          background: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '28px'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '10px', color: '#0f172a' }}>
            Extracted Document Text
          </h3>
          <pre style={{
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace',
            fontSize: '0.95rem',
            backgroundColor: '#f8fafc',
            padding: '16px',
            borderRadius: '8px',
            color: '#334155',
            lineHeight: 1.5,
            maxHeight: '300px',
            overflowY: 'auto'
          }}>
            {report.extractedText || 'No extracted text available.'}
          </pre>
        </div>
      )}

      {/* Summary Section */}
      <div className="report-summary-box">
        <h2 className="report-summary-title">
          <Info size={24} />
          <span>Summary in Simple Language</span>
        </h2>
        <p className="report-summary-content">
          {analysis.summary || 'Summary generated for your medical document.'}
        </p>
      </div>

      {/* Prescription Medicines Review Section (Requirement 4, 5, 6, 7) */}
      {(analysis.isPrescription || report.reportType === 'Prescription' || (analysis.extractedMedicines && analysis.extractedMedicines.length > 0) || Boolean(analysis.prescriptionNotice)) && (
        <PrescriptionReviewSection
          extractedMedicines={analysis.extractedMedicines || []}
          prescriptionNotice={analysis.prescriptionNotice || ''}
        />
      )}

      {/* Test Results Table (Shown only when laboratory test parameters exist) */}
      {testResults.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>
              Laboratory Test Results
            </h2>
            <span style={{ fontSize: '0.95rem', color: '#64748b' }}>
              Showing {testResults.length} test parameter{testResults.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="results-table-container">
          <table className="results-table">
            <thead>
              <tr>
                <th>Test Name</th>
                <th>Your Value</th>
                <th>Reference Range</th>
                <th>Status</th>
                <th>What It Generally Means</th>
              </tr>
            </thead>
            <tbody>
              {testResults.map((item, idx) => (
                <tr key={idx}>
                  <td>
                    <div className="test-item-name">{item.testName}</div>
                  </td>
                  <td>
                    <strong style={{ fontSize: '1.15rem', color: '#0f172a' }}>{item.yourValue}</strong>{' '}
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{item.unit}</span>
                  </td>
                  <td style={{ color: '#475569', fontWeight: '600' }}>
                    {item.referenceRange} {item.unit}
                  </td>
                  <td>
                    <StatusBadge status={item.status} />
                  </td>
                  <td style={{ color: '#475569', fontSize: '0.95rem', maxWidth: '340px' }}>
                    {item.simpleMeaning}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Understand This Report - Comprehensive Section */}
      <div className="card" style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            backgroundColor: '#eff6ff',
            color: '#0f62fe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Stethoscope size={24} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>
            Understand This Report
          </h2>
        </div>

        {/* 1. What this report is about */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f62fe', marginBottom: '8px' }}>
            1. What this report is about
          </h3>
          <p style={{ fontSize: '1.1rem', color: '#334155', lineHeight: 1.6 }}>
            {analysis.summary}
          </p>
        </div>

        {/* 2. Important Values */}
        {importantValues.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#059669', marginBottom: '8px' }}>
              2. Important values in normal range
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {importantValues.map((val, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.05rem', color: '#334155' }}>
                  <CheckCircle2 size={18} style={{ color: '#059669', flexShrink: 0 }} />
                  <span>{val}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 3. Values that need attention */}
        {abnormalValues.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#d97706', marginBottom: '8px' }}>
              3. Values that need attention
            </h3>
            <div style={{
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: '12px',
              padding: '16px 20px'
            }}>
              <p style={{ fontSize: '1rem', color: '#92400e', marginBottom: '10px', fontWeight: '700' }}>
                Note: This value is outside the provided reference range and may require discussion with a healthcare professional.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {abnormalValues.map((val, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.05rem', color: '#78350f' }}>
                    <AlertTriangle size={18} style={{ color: '#d97706', flexShrink: 0 }} />
                    <span>{val}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Simple Term Explanations */}
      {explanations.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>
            Medical Terms Explained Simply
          </h2>
          <div className="terms-grid">
            {explanations.map((item, idx) => (
              <div key={idx} className="term-card">
                <h3 className="term-card-title">
                  <BookOpen size={20} />
                  <span>{item.term}</span>
                </h3>
                <p className="term-card-desc">
                  {item.simpleExplanation}
                </p>
                <div className="term-card-matters">
                  <strong>Why it matters:</strong> {item.whyItMatters}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Questions for Doctor */}
      {doctorQuestions.length > 0 && (
        <div className="questions-card">
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <HelpCircle size={26} style={{ color: '#0f62fe' }} />
            <span>Questions You May Ask Your Doctor</span>
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#64748b', marginTop: '6px' }}>
            Take these questions to your next appointment or write them in your diary:
          </p>

          <ul className="questions-list">
            {doctorQuestions.map((question, idx) => (
              <li key={idx} className="question-item">
                <HelpCircle size={20} />
                <span>{question}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Medical Report?"
        message={`Are you sure you want to delete "${report.fileName}"? This will permanently remove the extracted analysis from your account.`}
        confirmText="Yes, Delete Report"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </DashboardLayout>
  );
};

export default ReportDetails;
