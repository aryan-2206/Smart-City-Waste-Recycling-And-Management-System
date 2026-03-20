import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Action types
const AUTH_START = 'AUTH_START';
const AUTH_SUCCESS = 'AUTH_SUCCESS';
const AUTH_FAIL = 'AUTH_FAIL';
const LOGOUT = 'LOGOUT';
const UPDATE_USER = 'UPDATE_USER';
const CLEAR_ERROR = 'CLEAR_ERROR';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

// Mock users database
const mockUsers = {
  admin: {
    id: 'admin-001',
    email: 'admin@wastemanagement.com',
    password: 'admin123',
    name: 'System Administrator',
    role: 'admin',
    phone: '+1-555-0100',
    department: 'System Administration'
  },
  driver: {
    id: 'driver-001',
    email: 'driver@wastemanagement.com',
    password: 'driver123',
    name: 'Raj Kumar',
    role: 'driver',
    phone: '+1-555-0101',
    licenseNumber: 'DRV-001',
    truckId: 'TRK-001'
  },
  user: {
    id: 'user-001',
    email: 'user@wastemanagement.com',
    password: 'user123',
    name: 'John Doe',
    role: 'user',
    phone: '+1-555-0102',
    address: '123 Main St, City'
  }
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_START:
      return {
        ...state,
        loading: true,
        error: null
      };
    case AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null
      };
    case AUTH_FAIL:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload
      };
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: null
      };
    case UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    case CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    try {
      // Initialize auth state from localStorage
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (token && user) {
        const parsedUser = JSON.parse(user);
        dispatch({
          type: AUTH_SUCCESS,
          payload: parsedUser
        });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      // Clear corrupted data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, []);

  const login = async (email, password) => {
    try {
      dispatch({ type: AUTH_START });
      
      // Find user in mock database
      const foundUser = Object.values(mockUsers).find(user => 
        user.email === email && user.password === password
      );
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const token = `mock-token-${foundUser.id}-${Date.now()}`;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(foundUser));
      
      dispatch({
        type: AUTH_SUCCESS,
        payload: foundUser
      });
      
      console.log('Login successful - User:', foundUser);
      return { data: { user: foundUser } };
    } catch (error) {
      dispatch({
        type: AUTH_FAIL,
        payload: error.message
      });
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_START });
      
      // Check if email already exists
      const existingUser = Object.values(mockUsers).find(user => 
        user.email === userData.email
      );
      
      if (existingUser) {
        throw new Error('Email already registered');
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser = {
        id: `user-${Date.now()}`,
        email: userData.email,
        name: userData.name,
        role: userData.role || 'user',
        phone: userData.phone || '',
        // Register form uses `location`, but the app displays it as `address`.
        address: userData.address || userData.location || ''
      };
      
      const token = `mock-token-${newUser.id}-${Date.now()}`;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      dispatch({
        type: AUTH_SUCCESS,
        payload: newUser
      });
      
      return { data: { user: newUser } };
    } catch (error) {
      dispatch({
        type: AUTH_FAIL,
        payload: error.message
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Mock logout - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    dispatch({ type: LOGOUT });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateProfile = async (userData) => {
    try {
      // Mock profile update - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = { ...state.user, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      dispatch({
        type: UPDATE_USER,
        payload: userData
      });
      
      return { data: { user: updatedUser } };
    } catch (error) {
      dispatch({
        type: AUTH_FAIL,
        payload: error.message
      });
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: CLEAR_ERROR });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    clearError,
    isAuthenticated: !!localStorage.getItem('token') && !!localStorage.getItem('user'),
    hasRole: (role) => state.user && state.user.role === role,
    hasPermission: (permission) => {
      if (!state.user) return false;
      if (state.user.role === 'admin') return true;
      return state.user.permissions && state.user.permissions[permission];
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
