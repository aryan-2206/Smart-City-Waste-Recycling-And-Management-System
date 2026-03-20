import React, { createContext, useContext, useReducer, useEffect } from 'react';
import authService from '../services/authService';

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
    // Initialize auth state from localStorage
    const user = authService.getCurrentUser();
    if (user) {
      dispatch({
        type: AUTH_SUCCESS,
        payload: user
      });
    }
  }, []);

  const login = async (email, password) => {
    try {
      dispatch({ type: AUTH_START });
      const response = await authService.login(email, password);
      dispatch({
        type: AUTH_SUCCESS,
        payload: response.data.user
      });
      return response;
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
      const response = await authService.register(userData);
      dispatch({
        type: AUTH_SUCCESS,
        payload: response.data.user
      });
      return response;
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
      await authService.logout();
      dispatch({ type: LOGOUT });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (userData) => {
    try {
      const response = await authService.updateProfile(userData);
      dispatch({
        type: UPDATE_USER,
        payload: response.data.user
      });
      return response;
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
    isAuthenticated: authService.isAuthenticated(),
    hasRole: authService.hasRole.bind(authService),
    hasPermission: authService.hasPermission.bind(authService)
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
