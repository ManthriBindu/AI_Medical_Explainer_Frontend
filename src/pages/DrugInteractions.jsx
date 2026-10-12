import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Plus,
  X,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Search
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import medicineService from '../services/medicineService';

const DrugInteractions = () => {
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [inputMedicine, setInputMedicine] = useState('');
  const [userMedicines, setUserMedicines] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUserMedicines();
  }, []);

  const loadUserMedicines = async () => {
    try {
      setInitialLoading(true);
      const data = await medicineService.getAllMedicines();
      setUserMedicines(data || []);
      // If user has medicines, pre-populate up to 2
      if (data && data.length >= 2) {
        setSelectedMedicines([data[0].medicineName, data[1].medicineName]);
      }
    } catch (err) {
      console.error('Failed to load user medicines:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleAddMedicine = (name) => {
    const trimmed = (name || inputMedicine).trim();
    if (!trimmed) return;

    if (selectedMedicines.some((m) => m.toLowerCase() === trimmed.toLowerCase())) {
      setError(`"${trimmed}" is already added to the check list.`);
      return;
    }

    setSelectedMedicines([...selectedMedicines, trimmed]);
    setInputMedicine('');
    setError('');
    setResult(null);
  };

  const handleRemoveMedicine = (name) => {
    setSelectedMedicines(selectedMedicines.filter((m) => m !== name));
    setResult(null);
  };

  const handleCheck = async () => {
    if (selectedMedicines.length < 2) {
      setError('Please add at least 2 medications to check for potential drug interactions.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await medicineService.checkInteractions(selectedMedicines);
      setResult(data);
    } catch (err) {
      console.error('Interaction check failed:', err);
      setError('Unable to perform interaction check right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const samplePairs = [
    ['Aspirin', 'Ibuprofen'],
    ['Aspirin', 'Warfarin'],
    ['Metformin', 'Alcohol'],
    ['Lisinopril', 'Potassium'],
    ['Atorvastatin', 'Clarithromycin'],
  ];

  return (
    <DashboardLayout>
      <div className="interaction-container">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <ShieldAlert size={34} />
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a' }}>
            Check Drug Interactions
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#475569', maxWidth: '600px', margin: '0 auto' }}>
            Enter two or more medicines you take to check whether there are any well-known clinical interactions.
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        {/* Medicine Input & Selected Tags Card */}
        <div className="card" style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '14px', color: '#0f172a' }}>
            Medicines To Check:
          </h3>

          {/* Selected Medicine Tags */}
          <div className="selected-tags-box">
            {selectedMedicines.length === 0 ? (
              <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                No medicines selected yet. Add at least two medicines below.
              </span>
            ) : (
              selectedMedicines.map((med) => (
                <span key={med} className="medicine-tag">
                  <span>{med}</span>
                  <button
                    onClick={() => handleRemoveMedicine(med)}
                    aria-label={`Remove ${med}`}
                  >
                    <X size={16} />
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Input field + Add button */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddMedicine();
            }}
            style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}
          >
            <input
              type="text"
              placeholder="Type medicine name (e.g. Aspirin, Metformin, Warfarin...)"
              className="form-input"
              value={inputMedicine}
              onChange={(e) => setInputMedicine(e.target.value)}
            />
            <button
              type="button"
              onClick={() => handleAddMedicine()}
              className="btn btn-secondary"
              style={{ flexShrink: 0 }}
            >
              <Plus size={20} />
              <span>Add</span>
            </button>
          </form>

          {/* Quick Add from User's Current Medicines */}
          {userMedicines.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '8px' }}>
                Quick Add From Your Active Medicines:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {userMedicines.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleAddMedicine(m.medicineName)}
                    className="btn btn-secondary"
                    style={{ padding: '6px 14px', fontSize: '0.9rem', minHeight: '36px' }}
                    disabled={selectedMedicines.includes(m.medicineName)}
                  >
                    + {m.medicineName}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Demo Pair Suggestions */}
          <div>
            <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '8px' }}>
              Or Try A Sample Clinical Pair:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {samplePairs.map(([a, b], idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedMedicines([a, b]);
                    setResult(null);
                  }}
                  className="btn btn-outline"
                  style={{ padding: '6px 14px', fontSize: '0.9rem', minHeight: '36px' }}
                >
                  {a} + {b}
                </button>
              ))}
            </div>
          </div>

          {/* Check Button */}
          <div style={{ marginTop: '28px', textAlign: 'center' }}>
            <button
              onClick={handleCheck}
              className="btn btn-primary btn-large"
              disabled={loading || selectedMedicines.length < 2}
              style={{ width: '100%', maxWidth: '360px' }}
            >
              <ShieldAlert size={22} />
              <span>{loading ? 'Checking Interactions...' : 'Check Interactions'}</span>
            </button>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className={`interaction-result-card ${result.interactionFound ? (result.interactions.some(i => i.severity === 'High') ? 'danger' : 'caution') : 'safe'}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              {result.interactionFound ? (
                <AlertTriangle size={32} style={{ color: result.interactions.some(i => i.severity === 'High') ? '#dc2626' : '#d97706' }} />
              ) : (
                <CheckCircle2 size={32} style={{ color: '#059669' }} />
              )}
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>
                  {result.interactionFound ? 'Interaction Notice' : 'No Common Interaction Found'}
                </h2>
                <p style={{ fontSize: '1.1rem', color: '#475569', marginTop: '4px' }}>
                  {result.generalSummary}
                </p>
              </div>
            </div>

            {/* List of Interactions */}
            {result.interactionFound && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
                {result.interactions.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '20px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
                      <h4 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a' }}>
                        {item.medicineA} + {item.medicineB}
                      </h4>
                      <span className={`status-badge ${item.severity === 'High' ? 'status-badge-red' : 'status-badge-amber'}`}>
                        {item.severity} Severity
                      </span>
                    </div>

                    <p style={{ fontSize: '1.05rem', color: '#334155', lineHeight: 1.6, marginBottom: '12px' }}>
                      <strong>General Description:</strong> {item.description}
                    </p>

                    <div style={{
                      backgroundColor: '#f8fafc',
                      borderLeft: '4px solid #0f62fe',
                      padding: '12px 16px',
                      borderRadius: '6px',
                      fontSize: '1rem',
                      color: '#1e293b'
                    }}>
                      <strong>Recommendation:</strong> {item.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DrugInteractions;
