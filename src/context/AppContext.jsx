import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';

// Create context with default values
export const AppContext = createContext({
  isLoggedIn: false,
  userData: null,
  authLoading: true,
  checkAuth: () => {},
  login: () => Promise.resolve(false),
  register: () => Promise.resolve(false),
  logout: () => {}
});

const AppContextProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => {
    const savedAuth = localStorage.getItem('authState');
    return savedAuth 
      ? JSON.parse(savedAuth) 
      : { isLoggedIn: false, userData: null, isLoading: true };
  });

  const checkAuth = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const response = await axiosInstance.get('/me');
      if (response.data) {
        const newAuthState = {
          isLoggedIn: true,
          userData: response.data,
          isLoading: false
        };
        setAuthState(newAuthState);
        localStorage.setItem('authState', JSON.stringify(newAuthState));
        return true;
      }
      return false;
    } catch (error) {
      setAuthState({
        isLoggedIn: false,
        userData: null,
        isLoading: false
      });
      localStorage.removeItem('authState');
      return false;
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (credentials) => {
    try {
      const response = await axiosInstance.post('/login', credentials);
      if (response.data) {
        await checkAuth();
        toast.success("Login successful");
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
    return false;
  }, [checkAuth]);

  const register = useCallback(async (userData) => {
    try {
      await axiosInstance.post('/register', userData);
      toast.success("Registration successful");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
    return false;
  }, []);

  const logout = useCallback(async () => {
    try {
      await axiosInstance.post('/logout');
    } finally {
      setAuthState({
        isLoggedIn: false,
        userData: null,
        isLoading: false
      });
      localStorage.removeItem('authState');
      document.cookie.split(';').forEach(c => {
        document.cookie = c.trim().split('=')[0] + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      });
    }
  }, []);

  const value = useMemo(() => ({
    isLoggedIn: authState.isLoggedIn,
    userData: authState.userData,
    authLoading: authState.isLoading,
    checkAuth,
    login,
    register,
    logout
  }), [authState, checkAuth, login, register, logout]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
