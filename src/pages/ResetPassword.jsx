import React, { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import axios from "axios";
import { FaEnvelope } from "react-icons/fa";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { backendURL, getUserData } = useContext(AppContext);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const inputsRef = useRef([]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").slice(0, 6);
    if (!/^[0-9]{6}$/.test(paste)) return toast.error("Invalid OTP format");

    const otpArray = paste.split("");
    setOtp(otpArray);
    otpArray.forEach((digit, i) => {
      if (inputsRef.current[i]) inputsRef.current[i].value = digit;
    });
    inputsRef.current[5]?.focus();
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");

    setLoading(true);
    try {
      await axios.post(`${backendURL}/send-reset-otp?email=${email}`);
      toast.success("OTP sent to your email");
      setIsEmailSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP Enter Valid Email!");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join("");
    if (otp.includes("")) return toast.error("Please complete the OTP");
    if (!newPassword) return toast.error("Please enter a new password");

    setLoading(true);
    try {
      const res = await axios.post(
        `${backendURL}/reset-password`,
        { otp: otpValue, newPassword, email },
        { withCredentials: true }
      );

      if (res.status === 200) {
        toast.success("Password reset successfully");
        getUserData();
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-white px-4 relative">
      {/* Navbar */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-8 h-8" />
          <span className="text-xl font-semibold">Authify</span>
        </Link>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition"
        >
          Back to Home
        </button>
      </div>

      {/* Email Form */}
      {!isEmailSent && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-sm text-center"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h2>
          <p className="text-sm text-gray-600 mb-6">
            Enter your registered email address
          </p>

          <form onSubmit={handleSendEmail}>
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2 mb-6 bg-gray-100 shadow-inner">
              <FaEnvelope className="text-gray-500 text-lg" />
              <input
                type="email"
                placeholder="Enter email address"
                className="bg-transparent focus:outline-none w-full text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              className={`w-full py-2 rounded-lg font-semibold text-white transition ${loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {loading ? "Submitting..." : "Submit"}
            </motion.button>
          </form>
        </motion.div>
      )}

      {/* OTP Form */}
      {isEmailSent && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-sm"
        >
          <h4 className="text-2xl font-bold text-center mb-2 text-blue-800">
            Verify OTP
          </h4>
          <p className="text-center text-sm text-gray-600 mb-6">
            A 6-digit code has been sent to your email.
          </p>

          <div className="flex justify-center items-center gap-2 mb-6">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                type="text"
                maxLength={1}
                value={otp[i]}
                onChange={(e) => handleChange(e.target.value, i)}
                onPaste={handlePaste}
                className="w-10 h-12 text-center text-xl font-bold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ))}
          </div>

          <input
            type="password"
            placeholder="New Password"
            className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <motion.button
            whileHover={{ scale: loading ? 1 : 1.03 }}
            whileTap={{ scale: loading ? 1 : 0.97 }}
            disabled={loading}
            onClick={handleVerifyOtp}
            className={`w-full flex justify-center items-center gap-2 ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} text-white py-2 rounded-lg font-semibold transition-colors`}
          >
            {loading ? (
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
              </div>
            ) : (
              <>
                <MdOutlineMarkEmailRead className="text-xl" />
                Verify & Reset Password
              </>
            )}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default ResetPassword;
