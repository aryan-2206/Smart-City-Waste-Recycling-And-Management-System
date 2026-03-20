const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor
    this.requestInterceptor = (config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    };

    // Response interceptor for token refresh
    this.responseInterceptor = (response) => {
      if (response.data.token) {
        this.setToken(response.data.token);
      }
      return response;
    };
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (data.data.user && data.token) {
      this.setToken(data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    
    return data;
  }

  async register(userData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (data.data.user && data.token) {
      this.setToken(data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    
    return data;
  }

  async logout() {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    this.removeToken();
    localStorage.removeItem('user');
  }

  async getProfile() {
    return await this.request('/auth/me');
  }

  async updateProfile(userData) {
    const data = await this.request('/auth/update-me', {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
    
    if (data.data.user) {
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    
    return data;
  }

  // Reports endpoints
  async getReports(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/reports?${queryString}`);
  }

  async createReport(reportData) {
    const formData = new FormData();
    
    // Add all report fields
    Object.keys(reportData).forEach(key => {
      if (key === 'photos' && reportData[key]) {
        reportData[key].forEach(file => {
          formData.append('photos', file);
        });
      } else {
        formData.append(key, reportData[key]);
      }
    });

    return await this.request('/reports', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }

  async getReport(id) {
    return await this.request(`/reports/${id}`);
  }

  async assignReport(id, assignmentData) {
    return await this.request(`/reports/${id}/assign`, {
      method: 'PATCH',
      body: JSON.stringify(assignmentData),
    });
  }

  async updateReportStatus(id, status) {
    return await this.request(`/reports/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async completeReport(id, completionData) {
    const formData = new FormData();
    
    Object.keys(completionData).forEach(key => {
      if (key === 'photos' && completionData[key]) {
        completionData[key].forEach(file => {
          formData.append('photos', file);
        });
      } else {
        formData.append(key, completionData[key]);
      }
    });

    return await this.request(`/reports/${id}/complete`, {
      method: 'PATCH',
      body: formData,
      headers: {},
    });
  }

  // Assignments endpoints
  async getAssignments(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/assignments?${queryString}`);
  }

  async getMyAssignments() {
    return await this.request('/assignments/my-assignments');
  }

  async createAssignment(assignmentData) {
    return await this.request('/assignments', {
      method: 'POST',
      body: JSON.stringify(assignmentData),
    });
  }

  async startAssignment(id) {
    return await this.request(`/assignments/${id}/start`, {
      method: 'POST',
    });
  }

  async completeAssignment(id, completionData) {
    return await this.request(`/assignments/${id}/complete`, {
      method: 'POST',
      body: JSON.stringify(completionData),
    });
  }

  // Inventory endpoints
  async getInventory(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/inventory?${queryString}`);
  }

  async getLowStockItems() {
    return await this.request('/inventory/low-stock');
  }

  async getOutOfStockItems() {
    return await this.request('/inventory/out-of-stock');
  }

  async getInventoryStats() {
    return await this.request('/inventory/stats');
  }

  async createInventoryItem(itemData) {
    const formData = new FormData();
    
    Object.keys(itemData).forEach(key => {
      if (key === 'images' && itemData[key]) {
        itemData[key].forEach(file => {
          formData.append('images', file);
        });
      } else {
        formData.append(key, itemData[key]);
      }
    });

    return await this.request('/inventory', {
      method: 'POST',
      body: formData,
      headers: {},
    });
  }

  async updateInventoryItem(id, itemData) {
    const formData = new FormData();
    
    Object.keys(itemData).forEach(key => {
      if (key === 'images' && itemData[key]) {
        itemData[key].forEach(file => {
          formData.append('images', file);
        });
      } else {
        formData.append(key, itemData[key]);
      }
    });

    return await this.request(`/inventory/${id}`, {
      method: 'PUT',
      body: formData,
      headers: {},
    });
  }

  async restockItem(id, restockData) {
    return await this.request(`/inventory/${id}/restock`, {
      method: 'POST',
      body: JSON.stringify(restockData),
    });
  }

  // Fleet endpoints
  async getVehicles(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/fleet?${queryString}`);
  }

  async getFleetStats() {
    return await this.request('/fleet/stats');
  }

  async createVehicle(vehicleData) {
    return await this.request('/fleet', {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    });
  }

  async updateVehicle(id, vehicleData) {
    return await this.request(`/fleet/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vehicleData),
    });
  }

  async updateVehicleStatus(id, statusData) {
    return await this.request(`/fleet/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    });
  }

  async updateVehicleLocation(id, locationData) {
    return await this.request(`/fleet/${id}/update-location`, {
      method: 'POST',
      body: JSON.stringify(locationData),
    });
  }

  // Analytics endpoints
  async getDashboardAnalytics() {
    return await this.request('/analytics/dashboard');
  }

  async getReportAnalytics(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/analytics/reports?${queryString}`);
  }

  async getFleetAnalytics(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/analytics/fleet?${queryString}`);
  }

  async getInventoryAnalytics(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/analytics/inventory?${queryString}`);
  }

  async getEnvironmentalImpact(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/analytics/environmental?${queryString}`);
  }

  async getTrends(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/analytics/trends?${queryString}`);
  }

  // Settings endpoints
  async getSettings() {
    return await this.request('/settings');
  }

  async updateSettings(settingsData) {
    return await this.request('/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData),
    });
  }

  async getSystemSettings() {
    return await this.request('/settings/system');
  }

  async exportData(format = 'json') {
    return await this.request(`/analytics/export?format=${format}`, {
      method: 'GET',
    });
  }

  // Utility methods
  async uploadFile(file, folder = 'general') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    return await this.request('/upload', {
      method: 'POST',
      body: formData,
      headers: {},
    });
  }

  async search(query, type = 'all') {
    const params = { q: query, type };
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/search?${queryString}`);
  }

  // Health check
  async healthCheck() {
    return await this.request('/health');
  }
}

export default new ApiService();
