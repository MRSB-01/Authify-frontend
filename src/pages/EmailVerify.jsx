import { MdOutlineMarkEmailRead } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useRef, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const EmailVerify = () => {
  const inputsRef = useRef([]);
  const [loading, setLoading] = useState(false);
  const { backendURL, getUserData, isLoggedIn, userData, isAccountVerified } = useContext(AppContext);

  const navigate = useNavigate();
  const otpLength = 6;
  const [otp, setOtp] = useState(new Array(otpLength).fill(""));

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otpLength - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    if (!/^\d+$/.test(pastedData)) {
      toast.error("Only numeric OTP allowed");
      return;
    }

    const digits = pastedData.slice(0, otpLength).split("");
    const newOtp = [...otp];

    digits.forEach((digit, idx) => {
      newOtp[idx] = digit;
      if (inputsRef.current[idx]) {
        inputsRef.current[idx].value = digit;
      }
    });

    setOtp(newOtp);

    // Focus next empty input
    const firstEmpty = newOtp.findIndex((d) => d === "");
    if (firstEmpty !== -1 && inputsRef.current[firstEmpty]) {
      inputsRef.current[firstEmpty].focus();
    } else {
      inputsRef.current[otpLength - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    if (otp.includes("")) {
      toast.error("Please fill all OTP digits");
      return;
    }

    const otpValue = otp.join("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${backendURL}/verify-otp`,
        { otp: otpValue },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("OTP verified successfully!");
        getUserData();
        navigate("/");
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn && userData && userData.isAccountVerified && navigate("/");
  }, [isLoggedIn, userData]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-white px-4 relative">
      {/* Header */}

      <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
        {/* Left Logo */}
        <Link to="/" className="flex items-center gap-2 no-underline">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-8 h-8"
            onClick={() => navigate("/")}
          />
          <span
            onClick={() => navigate("/")}
            className="text-xl font-semibold text-gray-800"
          >
            Authify
          </span>
        </Link>

        {/* Right Button */}
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow cursor-pointer font-medium transition"
        >
          Back to Home
        </button>
      </div>




      {/* OTP Card */}
      <motion.div
        className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-sm backdrop-blur-xl border border-blue-200"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h4 className="text-2xl font-bold text-center mb-2 text-blue-800">
          Enter verification code
        </h4>
        <p className="text-center text-sm text-gray-600 mb-6">
          A 6-digit code has been sent to your email.
        </p>

        <div className="flex justify-center items-center gap-2 mb-6">
          {[...Array(otpLength)].map((_, i) => (
            <input
              key={`otp-${i}`}
              ref={(el) => (inputsRef.current[i] = el)}
              type="text"
              maxLength={1}
              value={otp[i]}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={handlePaste}
              className="w-10 h-12 text-center text-xl font-bold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          ))}
        </div>

        <motion.button
          whileHover={{ scale: loading ? 1 : 1.03 }}
          whileTap={{ scale: loading ? 1 : 0.97 }}
          onClick={handleVerify}
          disabled={loading}
          className={`w-full flex justify-center items-center gap-2 ${loading
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
            } text-white py-2 rounded-lg font-semibold transition-colors cursor-pointer`}
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
              Verify Email
            </>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default EmailVerify;
