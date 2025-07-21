import React, { createContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => {
    // Initialize from localStorage if available
    const savedAuth = localStorage.getItem('authState');
    return savedAuth 
      ? JSON.parse(savedAuth) 
      : { isLoggedIn: false, userData: null, isLoading: true };
  });

  // Persistent auth check with loading state
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
    } catch (error) {
      const newAuthState = {
        isLoggedIn: false,
        userData: null,
        isLoading: false
      };
      setAuthState(newAuthState);
      localStorage.removeItem('authState');
      
      // Only show error if it's not a 401 (unauthorized)
      if (error.response?.status !== 401) {
        console.error("Auth check error:", error);
        toast.error("Session verification failed");
      }
      return false;
    }
  }, []);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials) => {
    try {
      await axiosInstance.post('/login', credentials);
      const success = await checkAuth();
      if (success) {
        toast.success("Login successful");
        return true;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed");
    }
    return false;
  };

  const register = async (userData) => {
    try {
      await axiosInstance.post('/register', userData);
      const success = await checkAuth();
      if (success) {
        toast.success("Registration successful");
        return true;
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Registration failed");
    }
    return false;
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/logout');
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setAuthState({
        isLoggedIn: false,
        userData: null,
        isLoading: false
      });
      localStorage.removeItem('authState');
      
      // Clear all cookies
      document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.trim().split('=');
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });
    }
  };

  const contextValue = {
    isLoggedIn: authState.isLoggedIn,
    userData: authState.userData,
    authLoading: authState.isLoading,
    checkAuth,
    login,
    register,
    logout
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
