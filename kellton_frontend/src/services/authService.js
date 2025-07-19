import api from './api';

export const authService = {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async register(credentials) {
    const response = await api.post('/auth/register', credentials);
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/users/me');
    return response.data;
  },

  async updateProfile(updates) {
    const response = await api.put('/users/me', updates);
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}; 