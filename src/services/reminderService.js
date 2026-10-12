import api from './api';

export const reminderService = {
  async getTodayReminders() {
    const response = await api.get('/reminders/today');
    return response.data;
  },

  async createReminder(medicineId, reminderTime, status = 'Upcoming') {
    const response = await api.post('/reminders', { medicineId, reminderTime, status });
    return response.data;
  },

  async updateReminderStatus(id, status) {
    const response = await api.put(`/reminders/${id}`, { status });
    return response.data;
  },

  async deleteReminder(id) {
    const response = await api.delete(`/reminders/${id}`);
    return response.data;
  }
};

export default reminderService;
