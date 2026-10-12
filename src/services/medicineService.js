import api from './api';

export const medicineService = {
  async getAllMedicines() {
    const response = await api.get('/medicines');
    return response.data;
  },

  async getMedicineById(id) {
    const response = await api.get(`/medicines/${id}`);
    return response.data;
  },

  async createMedicine(data) {
    const response = await api.post('/medicines', data);
    return response.data;
  },

  async updateMedicine(id, data) {
    const response = await api.put(`/medicines/${id}`, data);
    return response.data;
  },

  async deleteMedicine(id) {
    const response = await api.delete(`/medicines/${id}`);
    return response.data;
  },

  async createMedicinesBatch(medicinesList) {
    const response = await api.post('/medicines/batch', medicinesList);
    return response.data;
  },

  async extractPrescription(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/reports/extract-prescription', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async checkInteractions(medicineNames) {
    const response = await api.post('/interactions/check', { medicineNames });
    return response.data;
  }
};

export default medicineService;
