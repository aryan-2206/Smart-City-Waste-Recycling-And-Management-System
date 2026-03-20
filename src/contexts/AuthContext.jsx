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
      // Mock login for now - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        id: 1,
        email,
        name: 'Test User',
        role: 'admin'
      };
      
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      dispatch({
        type: AUTH_SUCCESS,
        payload: mockUser
      });
      
      return { data: { user: mockUser } };
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
      // Mock registration for now - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        id: 2,
        email: userData.email,
        name: userData.name,
        role: userData.role || 'operator'
      };
      
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      dispatch({
        type: AUTH_SUCCESS,
        payload: mockUser
      });
      
      return { data: { user: mockUser } };
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
