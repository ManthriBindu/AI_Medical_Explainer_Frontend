import api from './api';
import { setToken, setStoredUser, removeToken } from '../utils/token';

export const authService = {
  async register(name, email, password) {
    const response = await api.post('/auth/register', { name, email, password });
    if (response.data && response.data.token) {
      setToken(response.data.token);
      setStoredUser(response.data.user);
    }
    return response.data;
  },

  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.data && response.data.token) {
      setToken(response.data.token);
      setStoredUser(response.data.user);
    }
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    if (response.data) {
      setStoredUser(response.data);
    }
    return response.data;
  },

  logout() {
    removeToken();
  }
};

export default authService;
