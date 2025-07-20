import React, { createContext, useState } from 'react'
import { AppConstant } from '../utils/constants';
import axios from 'axios';
import { toast } from 'react-toastify';

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const backendURL = AppConstant.BACKEND_URL;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(false);

    const getUserData = async () => {
    try {
        const token = localStorage.getItem("token"); // <-- Get token from localStorage

        const response = await axios.get(`${backendURL}/me`, {
            headers: {
                Authorization: `Bearer ${token}`, // <-- Add token to headers
            },
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
        console.error(error);
    }
};



    const contextValue = {
        backendURL,
        isLoggedIn, setIsLoggedIn,
        userData, setUserData,
        getUserData,
    }

    return (
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider
