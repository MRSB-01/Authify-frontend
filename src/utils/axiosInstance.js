import axios from "axios";

const instance = axios.create({
  baseURL: 'https://authify-spring-boot-backend.onrender.com/api/v1.0',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add CSRF token interceptor if your backend uses CSRF protection
instance.interceptors.request.use(config => {
  const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];
  
  if (csrfToken) {
    config.headers['X-CSRF-TOKEN'] = csrfToken;
  }
  return config;
});

export default instance;
