import { API_CONFIG } from '../utils/constants';
import AuthService from './authService';

export const penguinService = {
  // Helper to get auth headers
  getHeaders() {
    return {
      'Content-Type': 'application/json',
      ...AuthService.getAuthHeader()
    };
  },

  async fetchBackendData() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ROOT}`);
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Error connecting to backend:', error);
      return { 
        success: false, 
        error: 'Unable to connect to backend. Make sure the server is running on port 5000.' 
      };
    }
  },

  async fetchPenguins() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PENGUINS}`, {
        headers: this.getHeaders()
      });
      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.message || 'Failed to fetch penguins' };
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching penguins:', error);
      return { success: false, error: 'Failed to fetch penguins' };
    }
  },

  async fetchStats() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STATS}`, {
        headers: this.getHeaders()
      });
      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.message || 'Failed to fetch stats' };
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return { success: false, error: 'Failed to fetch stats' };
    }
  },

  async addPenguin(penguinData) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PENGUINS}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(penguinData)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        return { success: true, data: result };
      } else {
        return { success: false, error: result.message || result.error };
      }
    } catch (error) {
      console.error('Error adding penguin:', error);
      return { success: false, error: 'Failed to add penguin' };
    }
  },

  async deletePenguin(id) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PENGUINS}/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      
      const result = await response.json();
      
      if (response.ok) {
        return { success: true, data: result };
      } else {
        return { success: false, error: result.message || result.error };
      }
    } catch (error) {
      console.error('Error deleting penguin:', error);
      return { success: false, error: 'Failed to delete penguin' };
    }
  },

  async searchPenguins(searchTerm) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PENGUINS}/search?q=${encodeURIComponent(searchTerm)}`, {
        headers: this.getHeaders()
      });
      const result = await response.json();
      
      if (response.ok) {
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.message };
      }
    } catch (error) {
      console.error('Error searching penguins:', error);
      return { success: false, error: 'Failed to search penguins' };
    }
  }
};