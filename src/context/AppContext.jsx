import React, { createContext, useState, useEffect } from 'react';
import { AppConstant } from '../utils/constants';
import axiosInstance from '../utils/axiosInstance'; // Use your configured instance
import { toast } from 'react-toastify';

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const backendURL = AppConstant.BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Initialize from localStorage if available
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [userData, setUserData] = useState(null);

  // Check auth status on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getUserData();
      } catch (error) {
        setIsLoggedIn(false);
        localStorage.setItem('isLoggedIn', 'false');
      }
    };
    checkAuth();
  }, []);

  const getUserData = async () => {
    try {
      const response = await axiosInstance.get('/me'); // Use your instance
      
      if (response.status === 200 && response.data) {
        setUserData(response.data);
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', 'true');
      } else {
        logout();
      }
    } catch (error) {
      logout();
      console.error("Error fetching user:", error);
      if (error.response?.status !== 401) { // Don't show toast for unauthorized
        toast.error("Error fetching user data");
      }
    }
  };

  const logout = () => {
    setUserData(null);
    setIsLoggedIn(false);
    localStorage.setItem('isLoggedIn', 'false');
  };

  const contextValue = {
    backendURL,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
    logout
  };

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
