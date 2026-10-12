import api from './api';

export const reportService = {
  async uploadReport(file, reportType) {
    const formData = new FormData();
    formData.append('file', file);
    if (reportType) {
      formData.append('reportType', reportType);
    }

    const response = await api.post('/reports/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getAllReports() {
    const response = await api.get('/reports');
    return response.data;
  },

  async getReportById(id) {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  },

  async deleteReport(id) {
    const response = await api.delete(`/reports/${id}`);
    return response.data;
  }
};

export default reportService;
