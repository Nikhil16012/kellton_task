import api from './api';

export const taskService = {
  async createTask(taskData) {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  async getTasks() {
    const response = await api.get('/tasks');
    return response.data;
  },

  async updateTask(taskId, updates) {
    const response = await api.put(`/tasks/${taskId}`, updates);
    return response.data;
  },

  async deleteTask(taskId) {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  },

  async markTaskComplete(taskId) {
    const response = await api.patch(`/tasks/${taskId}/complete`);
    return response.data;
  }
}; 