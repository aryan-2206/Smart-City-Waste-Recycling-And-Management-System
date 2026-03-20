import api from './api';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.initializeAuth();
  }

  initializeAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      this.currentUser = JSON.parse(user);
      api.setToken(token);
    }
  }

  async login(email, password) {
    try {
      const response = await api.login({ email, password });
      this.currentUser = response.data.user;
      return response;
    } catch (error) {
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await api.register(userData);
      this.currentUser = response.data.user;
      return response;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    this.currentUser = null;
    api.removeToken();
    localStorage.removeItem('user');
  }

  async updateProfile(userData) {
    try {
      const response = await api.updateProfile(userData);
      this.currentUser = response.data.user;
      localStorage.setItem('user', JSON.stringify(this.currentUser));
      return response;
    } catch (error) {
      throw error;
    }
  }

  isAuthenticated() {
    return !!this.currentUser && !!localStorage.getItem('token');
  }

  getCurrentUser() {
    return this.currentUser;
  }

  hasRole(role) {
    return this.currentUser && this.currentUser.role === role;
  }

  hasPermission(permission) {
    if (!this.currentUser) return false;
    if (this.currentUser.role === 'admin') return true;
    return this.currentUser.permissions && this.currentUser.permissions[permission];
  }

  getToken() {
    return localStorage.getItem('token');
  }
}

export default new AuthService();
