import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';

export const AppContext = createContext();

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
      const newAuthState = {
        isLoggedIn: false,
        userData: null,
        isLoading: false
      };
      setAuthState(newAuthState);
      localStorage.removeItem('authState');
      
      if (error.response?.status !== 401) {
        console.error("Auth check error:", error);
        toast.error("Session verification failed");
      }
      return false;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const verifyAuth = async () => {
      await checkAuth();
      if (!isMounted) return;
    };

    verifyAuth();
    
    return () => {
      isMounted = false;
    };
  }, [checkAuth]);

  const login = async (credentials) => {
    try {
      const response = await axiosInstance.post('/login', credentials);
      if (response.data) {
        const newAuthState = {
          isLoggedIn: true,
          userData: response.data,
          isLoading: false
        };
        setAuthState(newAuthState);
        localStorage.setItem('authState', JSON.stringify(newAuthState));
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
      const response = await axiosInstance.post('/register', userData);
      if (response.data) {
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
      // Clear all cookies
      document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.split('=');
        document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
      });
      
      setAuthState({
        isLoggedIn: false,
        userData: null,
        isLoading: false
      });
      localStorage.removeItem('authState');
    }
  };

  const contextValue = useMemo(() => ({
    isLoggedIn: authState.isLoggedIn,
    userData: authState.userData,
    authLoading: authState.isLoading,
    checkAuth,
    login,
    register,
    logout
  }), [authState, checkAuth]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
