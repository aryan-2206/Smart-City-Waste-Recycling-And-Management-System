// Local Storage utilities for the Smart Waste Management System

const STORAGE_KEYS = {
  REPORTS: 'wasteReports',
  ASSIGNMENTS: 'assignments',
  DRIVERS: 'drivers',
  ROUTES: 'routes',
  USER_PREFERENCES: 'userPreferences',
  APP_STATE: 'appState'
};

// Generic storage operations
export const storage = {
  // Get data from localStorage
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error getting ${key} from storage:`, error);
      return defaultValue;
    }
  },

  // Set data to localStorage
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting ${key} to storage:`, error);
      return false;
    }
  },

  // Remove data from localStorage
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
      return false;
    }
  },

  // Clear all app data
  clear: () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }
};

// Specific data operations
export const reportsStorage = {
  getAll: () => storage.get(STORAGE_KEYS.REPORTS, []),
  add: (report) => {
    const reports = reportsStorage.getAll();
    const newReport = {
      ...report,
      id: report.id || `R-${Date.now()}`,
      timestamp: report.timestamp || new Date().toISOString(),
      status: report.status || 'pending'
    };
    reports.push(newReport);
    storage.set(STORAGE_KEYS.REPORTS, reports);
    return newReport;
  },
  update: (id, updates) => {
    const reports = reportsStorage.getAll();
    const index = reports.findIndex(r => r.id === id);
    if (index !== -1) {
      reports[index] = { ...reports[index], ...updates };
      storage.set(STORAGE_KEYS.REPORTS, reports);
      return reports[index];
    }
    return null;
  },
  delete: (id) => {
    const reports = reportsStorage.getAll();
    const filteredReports = reports.filter(r => r.id !== id);
    storage.set(STORAGE_KEYS.REPORTS, filteredReports);
    return true;
  }
};

export const assignmentsStorage = {
  getAll: () => storage.get(STORAGE_KEYS.ASSIGNMENTS, []),
  add: (assignment) => {
    const assignments = assignmentsStorage.getAll();
    const newAssignment = {
      ...assignment,
      id: assignment.id || Date.now(),
      createdAt: assignment.createdAt || new Date().toISOString()
    };
    assignments.push(newAssignment);
    storage.set(STORAGE_KEYS.ASSIGNMENTS, assignments);
    return newAssignment;
  },
  update: (id, updates) => {
    const assignments = assignmentsStorage.getAll();
    const index = assignments.findIndex(a => a.id === id);
    if (index !== -1) {
      assignments[index] = { ...assignments[index], ...updates };
      storage.set(STORAGE_KEYS.ASSIGNMENTS, assignments);
      return assignments[index];
    }
    return null;
  },
  delete: (id) => {
    const assignments = assignmentsStorage.getAll();
    const filteredAssignments = assignments.filter(a => a.id !== id);
    storage.set(STORAGE_KEYS.ASSIGNMENTS, filteredAssignments);
    return true;
  }
};

export const userPreferencesStorage = {
  get: () => storage.get(STORAGE_KEYS.USER_PREFERENCES, {
    theme: 'light',
    notifications: true,
    autoRefresh: false,
    refreshInterval: 30000
  }),
  update: (preferences) => {
    const current = userPreferencesStorage.get();
    const updated = { ...current, ...preferences };
    storage.set(STORAGE_KEYS.USER_PREFERENCES, updated);
    return updated;
  }
};

// Initialize default data if storage is empty
export const initializeStorage = () => {
  // Initialize with default reports if empty
  if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
    const defaultReports = [
      {
        id: 'R-001',
        binId: 'B-042',
        area: 'North Sector',
        wasteType: 'mixed',
        urgency: 'medium',
        description: 'Bin is overflowing and needs immediate attention',
        reporterName: 'John Doe',
        reporterContact: '+91 98765 43210',
        location: 'Near Main Market',
        hasPhoto: false,
        timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
        status: 'pending'
      },
      {
        id: 'R-002',
        binId: 'B-018',
        area: 'East Zone',
        wasteType: 'dry',
        urgency: 'low',
        description: 'Bin is about 80% full',
        reporterName: 'Jane Smith',
        reporterContact: '+91 98765 54321',
        location: 'Commercial Complex',
        hasPhoto: true,
        timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
        status: 'assigned'
      }
    ];
    storage.set(STORAGE_KEYS.REPORTS, defaultReports);
  }

  // Initialize with default assignments if empty
  if (!localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS)) {
    const defaultAssignments = [
      {
        id: 1,
        binId: 'B-042',
        area: 'North Sector',
        driver: 'Driver 07',
        driverName: 'Raj Kumar',
        status: 'assigned',
        priority: 'high',
        reportedTime: '5 mins ago',
        estimatedTime: '30 mins',
        wasteType: 'Mixed',
        location: 'Near Main Market',
        createdAt: new Date(Date.now() - 5 * 60000).toISOString()
      },
      {
        id: 2,
        binId: 'B-018',
        area: 'East Zone',
        driver: 'Driver 03',
        driverName: 'Amit Singh',
        status: 'enroute',
        priority: 'medium',
        reportedTime: '12 mins ago',
        estimatedTime: '15 mins',
        wasteType: 'Dry',
        location: 'Commercial Complex',
        createdAt: new Date(Date.now() - 12 * 60000).toISOString()
      }
    ];
    storage.set(STORAGE_KEYS.ASSIGNMENTS, defaultAssignments);
  }
};

export default storage;
