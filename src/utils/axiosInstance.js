import axios from "axios";

const axiosInstance = axios.create({
  baseURL: 'https://authify-spring-boot-backend.onrender.com/api/v1.0',
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
