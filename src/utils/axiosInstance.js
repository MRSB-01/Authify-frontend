import axios from "axios";

const instance = axios.create({
  baseURL: "https://authify-spring-boot-backend.onrender.com/api/v1.0",
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
