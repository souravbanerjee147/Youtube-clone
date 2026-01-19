import api from './api';

export const authService = {
  // Register user
  register: async (username, email, password) => {
    try {
      const response = await api.post('/auth/register', {
        username,
        email,
        password
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update profile
  updateProfile: async (updateData) => {
    try {
      const response = await api.put('/auth/profile', updateData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  }
};