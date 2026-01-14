const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class AuthService {
  // Register new user
  static async register(username, email, password) {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    // Store token
    if (data.data && data.data.token) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }

    return data;
  }

  // Login user
  static async login(email, password) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Store token
    if (data.data && data.data.token) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }

    return data;
  }

  // Logout user
  static async logout() {
    const token = this.getToken();

    if (token) {
      try {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    // Remove token and user from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Get current user
  static async getCurrentUser() {
    const token = this.getToken();

    if (!token) {
      return null;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Token might be invalid
        this.clearAuth();
        return null;
      }

      const data = await response.json();
      // Return user with penguin count
      return {
        ...data.data.user,
        penguinCount: data.data.penguinCount || 0
      };
    } catch (error) {
      console.error('Get current user error:', error);
      this.clearAuth();
      return null;
    }
  }

  // Verify token
  static async verifyToken() {
    const token = this.getToken();

    if (!token) {
      return false;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // Get stored token
  static getToken() {
    return localStorage.getItem('token');
  }

  // Get stored user
  static getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Check if user is authenticated
  static isAuthenticated() {
    return !!this.getToken();
  }

  // Clear authentication data
  static clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Get auth header for API requests
  static getAuthHeader() {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
}

export default AuthService;
