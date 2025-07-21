import { ToastContainer } from 'react-toastify';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';
import { useContext, useEffect } from 'react';
import { AppContext } from './context/AppContext';

function App() {
  const { getUserData } = useContext(AppContext);

  useEffect(() => {
    getUserData().catch((error) => console.error('Failed to get user data:', error));
  }, [getUserData]);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/email-verify" element={<EmailVerify />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </>
  );
}

export default App;
