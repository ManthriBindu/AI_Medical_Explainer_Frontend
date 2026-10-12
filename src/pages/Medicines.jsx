import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pill, Plus, Calendar, ShieldAlert, FileText, Sparkles } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import MedicineCard from '../components/MedicineCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';
import PrescriptionUploadModal from '../components/PrescriptionUploadModal';
import medicineService from '../services/medicineService';

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadMedicines();
  }, []);

  const loadMedicines = async () => {
    try {
      setLoading(true);
      const data = await medicineService.getAllMedicines();
      setMedicines(data || []);
    } catch (err) {
      console.error('Failed to load medicines:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (medicine) => {
    navigate(`/medicines/add`, { state: { medicine } });
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await medicineService.deleteMedicine(deleteId);
      setMedicines(medicines.filter((m) => m.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error('Failed to delete medicine:', err);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2.1rem', fontWeight: '800', color: '#0f172a' }}>
            My Medicines
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#475569' }}>
            Keep track of your active prescriptions, dosage instructions, and daily schedules.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowPrescriptionModal(true)}
            className="btn btn-secondary btn-large"
            style={{ backgroundColor: '#eff6ff', color: '#0f62fe', borderColor: '#bfdbfe', fontWeight: '700' }}
          >
            <FileText size={20} />
            <span>Auto-Extract from Prescription</span>
          </button>
          <Link to="/interactions" className="btn btn-secondary">
            <ShieldAlert size={18} />
            <span>Check Drug Interactions</span>
          </Link>
          <Link to="/medicines/add" className="btn btn-primary btn-large">
            <Plus size={20} />
            <span>+ Add Manually</span>
          </Link>
        </div>
      </div>

      {/* Elderly-Friendly Auto-Extraction Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)',
        border: '1px solid #bfdbfe',
        borderRadius: '14px',
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#0f62fe',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Sparkles size={22} />
          </div>
          <div>
            <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '1.05rem' }}>
              Have a doctor's prescription slip or PDF?
            </div>
            <div style={{ color: '#475569', fontSize: '0.95rem' }}>
              Upload it here to automatically extract medicine names, dosages, and schedules without typing.
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowPrescriptionModal(true)}
          className="btn btn-primary"
          style={{ whiteSpace: 'nowrap' }}
        >
          <FileText size={18} />
          <span>Upload Prescription</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading your medicines..." />
      ) : medicines.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <Pill size={48} style={{ color: '#94a3b8', margin: '0 auto 16px auto' }} />
          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
            No medicines added yet
          </h3>
          <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: '480px', margin: '0 auto 24px auto' }}>
            Upload your prescription to automatically extract your medicines, or add them manually to start tracking schedules and reminders.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowPrescriptionModal(true)}
              className="btn btn-primary btn-large"
            >
              <FileText size={20} />
              <span>Auto-Extract from Prescription</span>
            </button>
            <Link to="/medicines/add" className="btn btn-secondary btn-large">
              <Plus size={20} />
              <span>Add Manually</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="medicine-grid">
          {medicines.map((medicine) => (
            <MedicineCard
              key={medicine.id}
              medicine={medicine}
              onEdit={handleEdit}
              onDelete={(id) => setDeleteId(id)}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Medicine?"
        message="Are you sure you want to remove this medication from your active list?"
        confirmText="Yes, Delete"
        confirmVariant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />

      {/* Prescription Upload & Auto-Extract Modal (Requirement 2-8) */}
      <PrescriptionUploadModal
        isOpen={showPrescriptionModal}
        onClose={() => setShowPrescriptionModal(false)}
        onMedicinesSaved={() => {
          loadMedicines();
          setShowPrescriptionModal(false);
        }}
      />
    </DashboardLayout>
  );
};

export default Medicines;
