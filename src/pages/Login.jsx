import { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';

const Login = () => {
  const [isCreateAccount, setIsCreateAccount] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { isLoggedIn, authLoading, login, register } = useContext(AppContext);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isCreateAccount) {
        const success = await register(formData);
        if (success) {
          setFormData({ name: '', email: '', password: '' });
          setIsCreateAccount(false);
        }
      } else {
        const success = await login({
          email: formData.email,
          password: formData.password,
        });
        if (success) {
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(
        error.response?.data?.message ||
          (isCreateAccount ? 'Registration failed' : 'Login failed')
      );
      setFormData((prev) => ({ ...prev, password: '' }));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-white to-blue-200 px-4">
      <div
        className="absolute top-6 left-6 flex items-center gap-2 cursor-pointer"
        onClick={() => navigate('/')}
      >
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
          {isCreateAccount ? 'Register' : 'Login'}
        </h2>

        <form onSubmit={onSubmitHandler} className="space-y-4">
          {isCreateAccount && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
              <input
                type="text"
                name="name"
                required
                minLength={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
            />
          </div>

          {!isCreateAccount && (
            <div>
              <Link className="text-sm font-medium text-blue-700 hover:text-blue-900" to="/reset-password">
                Forgot password?
              </Link>
            </div>
          )}

          <motion.button
            disabled={loading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className={`w-full flex items-center justify-center ${
              loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            } text-white py-3 rounded-lg font-semibold transition-colors shadow-md`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : isCreateAccount ? 'Create Account' : 'Login'}
          </motion.button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          {isCreateAccount ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={() => {
              setIsCreateAccount((prev) => !prev);
              setFormData({ name: '', email: '', password: '' });
            }}
            className="ml-2 text-blue-600 hover:text-blue-800 font-medium cursor-pointer focus:outline-none underline"
          >
            {isCreateAccount ? 'Sign in instead' : 'Create one now'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
