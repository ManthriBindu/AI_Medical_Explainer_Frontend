import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Pill,
  Clock,
  AlertTriangle,
  Upload,
  Plus,
  Calendar,
  ArrowRight
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import ReportCard from '../components/ReportCard';
import ReminderCard from '../components/ReminderCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import useAuth from '../hooks/useAuth';
import reportService from '../services/reportService';
import medicineService from '../services/medicineService';
import reminderService from '../services/reminderService';

const Dashboard = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [reportsData, medicinesData, remindersData] = await Promise.all([
        reportService.getAllReports().catch(() => []),
        medicineService.getAllMedicines().catch(() => []),
        reminderService.getTodayReminders().catch(() => []),
      ]);

      setReports(reportsData || []);
      setMedicines(medicinesData || []);
      setReminders(remindersData || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateReminder = async (id, status) => {
    try {
      await reminderService.updateReminderStatus(id, status);
      // Refresh reminders
      const updated = await reminderService.getTodayReminders();
      setReminders(updated);
    } catch (err) {
      console.error('Failed to update reminder status', err);
    }
  };

  // Calculate attention items from reports
  const attentionCount = reports.reduce((acc, rep) => {
    if (rep.analysis && rep.analysis.abnormalValues && rep.analysis.abnormalValues.length > 0) {
      return acc + rep.analysis.abnormalValues.length;
    }
    return acc;
  }, 0);

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner text="Loading your health dashboard..." />
      </DashboardLayout>
    );
  }

  const firstName = user?.name ? user.name.split(' ')[0] : 'there';

  return (
    <DashboardLayout>
      {/* Greeting Banner */}
      <div className="dashboard-greeting-banner">
        <h1 className="dashboard-title">
          Good morning, {firstName}
        </h1>
        <p className="dashboard-subtitle">
          Here's your medical information at a glance.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-icon-box blue">
            <FileText size={32} />
          </div>
          <div className="summary-info">
            <span className="label">Uploaded Reports</span>
            <div className="value">{reports.length}</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon-box green">
            <Pill size={32} />
          </div>
          <div className="summary-info">
            <span className="label">Active Medicines</span>
            <div className="value">{medicines.length}</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon-box purple">
            <Clock size={32} />
          </div>
          <div className="summary-info">
            <span className="label">Today's Medicines</span>
            <div className="value">{reminders.length}</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon-box amber">
            <AlertTriangle size={32} />
          </div>
          <div className="summary-info">
            <span className="label">Attention Items</span>
            <div className="value">{attentionCount}</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-bar">
        <div className="quick-actions-label">
          Quick Actions
        </div>
        <div className="quick-actions-btns">
          <Link to="/upload" className="btn btn-primary btn-large">
            <Upload size={20} />
            <span>+ Upload Report</span>
          </Link>
          <Link to="/medicines/add" className="btn btn-secondary btn-large">
            <Plus size={20} />
            <span>+ Add Medicine</span>
          </Link>
          <Link to="/schedule" className="btn btn-outline btn-large">
            <Calendar size={20} />
            <span>View Schedule</span>
          </Link>
        </div>
      </div>

      {/* Two-Column Section: Recent Reports & Today's Medication */}
      <div className="dashboard-columns">
        {/* Left Column: Recent Reports */}
        <div>
          <div className="section-header-row">
            <h2 className="section-title">Recent Reports</h2>
            {reports.length > 0 && (
              <Link to="/reports" style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>View All ({reports.length})</span>
                <ArrowRight size={16} />
              </Link>
            )}
          </div>

          {reports.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No medical reports yet"
              description="Upload your first blood test, lab report, or prescription to get clear, plain-language explanations."
              actionText="Upload Report"
              actionLink="/upload"
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {reports.slice(0, 3).map((rep) => (
                <ReportCard key={rep.id} report={rep} />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Today's Medication */}
        <div>
          <div className="section-header-row">
            <h2 className="section-title">Today's Medication</h2>
            {reminders.length > 0 && (
              <Link to="/schedule" style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>Full Schedule</span>
                <ArrowRight size={16} />
              </Link>
            )}
          </div>

          {reminders.length === 0 ? (
            <EmptyState
              icon={Pill}
              title="No medicines scheduled today"
              description="Add your prescribed medicines to track daily timings and mark doses as taken."
              actionText="Add Medicine"
              actionLink="/medicines/add"
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {reminders.map((reminder) => (
                <ReminderCard
                  key={reminder.id}
                  reminder={reminder}
                  onUpdateStatus={handleUpdateReminder}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
