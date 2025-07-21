import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react'
import axiosInstance from '../utils/axiosInstance'
import { toast } from 'react-toastify'

// Add default implementations for all context functions
export const AppContext = createContext({
  isLoggedIn: false,
  userData: null,
  authLoading: true,
  checkAuth: () => Promise.resolve(false),
  login: () => Promise.resolve(false),
  register: () => Promise.resolve(false),
  logout: () => Promise.resolve()
})

const AppContextProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => {
    const savedAuth = localStorage.getItem('authState')
    return savedAuth ? JSON.parse(savedAuth) : { 
      isLoggedIn: false, 
      userData: null, 
      isLoading: true 
    }
  })

  const checkAuth = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }))
      const response = await axiosInstance.get('/me')
      
      if (response.data) {
        const newState = {
          isLoggedIn: true,
          userData: response.data,
          isLoading: false
        }
        setAuthState(newState)
        localStorage.setItem('authState', JSON.stringify(newState))
        return true
      }
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error('Auth check error:', error)
        toast.error('Session verification failed')
      }
      const newState = {
        isLoggedIn: false,
        userData: null,
        isLoading: false
      }
      setAuthState(newState)
      localStorage.removeItem('authState')
    }
    return false
  }, [])

  const login = useCallback(async (credentials) => {
    try {
      await axiosInstance.post('/login', credentials)
      const success = await checkAuth()
      if (success) {
        toast.success('Login successful')
        return true
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error.response?.data?.message || 'Login failed')
    }
    return false
  }, [checkAuth])

  const logout = useCallback(async () => {
    try {
      await axiosInstance.post('/logout')
    } finally {
      setAuthState({
        isLoggedIn: false,
        userData: null,
        isLoading: false
      })
      localStorage.removeItem('authState')
      // Clear all cookies reliably
      document.cookie.split(';').forEach(c => {
        document.cookie = c.trim().split('=')[0] + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;'
      })
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const value = useMemo(() => ({
    isLoggedIn: authState.isLoggedIn,
    userData: authState.userData,
    authLoading: authState.isLoading,
    login,
    logout,
    checkAuth
  }), [authState, login, logout, checkAuth])

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContextProvider
