import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Upload, Search, Filter } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import ReportCard from '../components/ReportCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';
import reportService from '../services/reportService';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All'); // All, Blood Test, Prescription, General Report
  const [loading, setLoading] = useState(true);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await reportService.getAllReports();
      setReports(data || []);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await reportService.deleteReport(deleteTargetId);
      setReports(reports.filter((r) => r.id !== deleteTargetId));
      setDeleteTargetId(null);
    } catch (err) {
      console.error('Failed to delete report:', err);
    }
  };

  const filteredReports = reports.filter((r) => {
    const matchesSearch = (r.fileName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (r.reportType || '').toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (filterType === 'All') return true;
    if (filterType === 'Prescription') return (r.reportType || '').toLowerCase().includes('prescription');
    if (filterType === 'Blood Test') return (r.reportType || '').toLowerCase().includes('blood') || (r.reportType || '').toLowerCase().includes('lipid');
    return true;
  });

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2.1rem', fontWeight: '800', color: '#0f172a' }}>
            My Medical Reports
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#475569' }}>
            Review and manage all your uploaded health documents.
          </p>
        </div>

        <Link to="/upload" className="btn btn-primary btn-large">
          <Upload size={20} />
          <span>+ Upload Report</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '18px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        marginBottom: '32px',
        flexWrap: 'wrap'
      }}>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1', minWidth: '240px' }}>
          <Search size={20} style={{ color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search reports by name or test..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              fontSize: '1.05rem',
              width: '100%',
              fontFamily: 'inherit'
            }}
          />
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['All', 'Blood Test', 'Prescription'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterType(tab)}
              className={`btn ${filterType === tab ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '6px 16px', fontSize: '0.95rem', minHeight: '38px' }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading your reports..." />
      ) : filteredReports.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={reports.length === 0 ? 'No medical reports yet' : 'No matching reports'}
          description={reports.length === 0 ? 'Upload your first report to get started.' : 'Try adjusting your search terms or filter selection.'}
          actionText={reports.length === 0 ? 'Upload Report' : undefined}
          actionLink={reports.length === 0 ? '/upload' : undefined}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '22px' }}>
          {filteredReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onDelete={(id) => setDeleteTargetId(id)}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Delete Medical Report?"
        message="Are you sure you want to delete this report? This cannot be undone."
        confirmText="Delete Report"
        confirmVariant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </DashboardLayout>
  );
};

export default Reports;
