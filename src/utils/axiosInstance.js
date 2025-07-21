import axios from 'axios';
import { AppConstant } from './constants';

const instance = axios.create({
  baseURL: AppConstant.BACKEND_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

instance.interceptors.request.use((config) => {
  const csrfToken = document.cookie
    .split('; ')
    .find((row) => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];
  const jwtToken = localStorage.getItem('jwtToken');
  if (csrfToken && ['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
    config.headers['X-CSRF-TOKEN'] = csrfToken;
  }
  if (jwtToken) {
    config.headers['Authorization'] = `Bearer ${jwtToken}`;
  }
  console.log('Request Headers:', config.headers); // Debug
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authState');
      localStorage.removeItem('jwtToken');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
