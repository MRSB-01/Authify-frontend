import React, { createContext, useState } from 'react';
import { AppConstant } from '../utils/constants';
import axios from 'axios';
import { toast } from 'react-toastify';

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const backendURL = AppConstant.BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const getUserData = async () => {
    try {
      const response = await axios.get(`${backendURL}/me`, {
        withCredentials: true, // used for cookie-based auth
      });

      if (response.status === 200 && response.data) {
        setUserData(response.data);
        setIsLoggedIn(true);
      } else {
        setUserData(null);
        setIsLoggedIn(false);
        toast.error("Unable to retrieve profile.");
      }
    } catch (error) {
      setUserData(null);
      setIsLoggedIn(false);
      console.error("Error fetching user:", error);
      toast.error("Session expired or unauthorized.");
    }
  };

  const contextValue = {
    backendURL,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
