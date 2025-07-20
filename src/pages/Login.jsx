import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
//import axios from "../utils/axiosInstance"; // 👈 use custom axios instance
import { AppContext } from "../context/AppContext";

const Login = () => {
  const [isCreateAccount, setIsCreateAccount] = useState(false);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setIsLoggedIn, getUserData } = useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isCreateAccount) {
        await axios.post("/register", { name, email, password });
        toast.success("Account created successfully");
        navigate("/");
      } else {
        await axios.post("/login", { email, password });
        toast.success("Login successful");
      }

      await getUserData();
      setIsLoggedIn(true);
      navigate("/");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        (isCreateAccount ? "Registration failed." : "Login failed. Please check your credentials.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-white to-blue-200 px-4">
      <div className="absolute top-6 left-6 flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
        <img src="/logo.png" alt="Logo" width={32} height={32} />
        <span className="text-xl font-semibold text-black drop-shadow">Authify</span>
      </div>

      <motion.div
        className="bg-white/60 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">
          {isCreateAccount ? "Register" : "Login"}
        </h2>

        <form onSubmit={onSubmitHandler} className="space-y-4">
          {isCreateAccount && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {!isCreateAccount && (
            <div>
              <Link className="text-sm font-medium text-blue-700" to={"/reset-password"}>
                Forgot password?
              </Link>
            </div>
          )}

          <motion.button
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-blue-700 cursor-pointer text-white py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
          >
            {loading ? "Loading..." : isCreateAccount ? "Create account" : "Login"}
          </motion.button>
        </form>

        <p
          onClick={() => setIsCreateAccount((prev) => !prev)}
          className="text-center text-sm text-gray-700 mt-4"
        >
          {isCreateAccount ? "I have an account?" : "Don't have an account?"}
          <span className="text-blue-700 hover:underline font-medium ms-2 cursor-pointer">
            {isCreateAccount ? "Login" : "Sign up"}
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
