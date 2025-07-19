import api from './api';

export const adminService = {
  async getAllUsers() {
    const response = await api.get('/admin/users');
    return response.data;
  },

  async deactivateUser(userId) {
    const response = await api.patch(`/admin/users/${userId}/deactivate`);
    return response.data;
  },

  async activateUser(userId) {
    const response = await api.patch(`/admin/users/${userId}/activate`);
    return response.data;
  },

  async getDashboardStats() {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  async getUserTasks(userId) {
    const response = await api.get(`/admin/users/${userId}/tasks`);
    return response.data;
  }
}; 