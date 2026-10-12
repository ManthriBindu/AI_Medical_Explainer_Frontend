import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarClock,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import ReminderCard from '../components/ReminderCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import reminderService from '../services/reminderService';

const MedicationSchedule = () => {
  const [reminders, setReminders] = useState([]);
  const [filter, setFilter] = useState('All'); // All, Upcoming, Taken
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      setLoading(true);
      const data = await reminderService.getTodayReminders();
      setReminders(data || []);
    } catch (err) {
      console.error('Failed to load reminders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await reminderService.updateReminderStatus(id, status);
      setReminders((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const filteredReminders = reminders.filter((r) => {
    if (filter === 'All') return true;
    if (filter === 'Upcoming') return r.status === 'Upcoming';
    if (filter === 'Taken') return r.status === 'Taken';
    return true;
  });

  const takenCount = reminders.filter((r) => r.status === 'Taken').length;
  const progressPercent = reminders.length > 0 ? Math.round((takenCount / reminders.length) * 100) : 0;

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2.1rem', fontWeight: '800', color: '#0f172a' }}>
            Today's Medication Schedule
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#475569' }}>
            Track your daily doses, stay on time, and mark medicines as taken.
          </p>
        </div>

        <Link to="/medicines/add" className="btn btn-primary btn-large">
          <Plus size={20} />
          <span>+ Add Medicine</span>
        </Link>
      </div>

      {/* Daily Progress Tracker Card */}
      {reminders.length > 0 && (
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '24px 28px',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>
                Daily Progress
              </span>
              <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f62fe' }}>
                {takenCount} of {reminders.length} doses taken ({progressPercent}%)
              </span>
            </div>
            {/* Progress Bar */}
            <div style={{ width: '100%', height: '12px', backgroundColor: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{
                width: `${progressPercent}%`,
                height: '100%',
                backgroundColor: progressPercent === 100 ? '#059669' : '#0f62fe',
                borderRadius: '6px',
                transition: 'width 0.4s ease'
              }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {['All', 'Upcoming', 'Taken'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`btn ${filter === tab ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '6px 16px', fontSize: '0.95rem', minHeight: '38px' }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <LoadingSpinner text="Loading today's schedule..." />
      ) : filteredReminders.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title={reminders.length === 0 ? 'No medication scheduled for today' : 'No medicines in this filter'}
          description={reminders.length === 0 ? 'Add your prescribed medicines to generate your daily medication timetable.' : 'Select another filter above to view your scheduled doses.'}
          actionText={reminders.length === 0 ? '+ Add Medicine' : undefined}
          actionLink={reminders.length === 0 ? '/medicines/add' : undefined}
        />
      ) : (
        <div className="schedule-timeline">
          {filteredReminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MedicationSchedule;
