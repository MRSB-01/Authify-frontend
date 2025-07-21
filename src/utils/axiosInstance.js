import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://authify-spring-boot-backend.onrender.com/api/v1.0',
  withCredentials: true
});

// Add this interceptor
instance.interceptors.request.use(config => {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];
  if (token) {
    config.headers['X-CSRF-TOKEN'] = token;
  }
  return config;
});

export default instance;
