import axios from "axios";

const instance = axios.create({
  baseURL: "https://authify-spring-boot-backend.onrender.com/api/v1.0",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
});

// Request interceptor for CSRF token
instance.interceptors.request.use(config => {
  const csrfToken = document.cookie
    .split("; ")
    .find(row => row.startsWith("XSRF-TOKEN="))
    ?.split("=")[1];
  
  if (csrfToken && ["post", "put", "patch", "delete"].includes(config.method.toLowerCase())) {
    config.headers["X-CSRF-TOKEN"] = csrfToken;
  }
  return config;
});

// Response interceptor to handle errors
instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Clear any existing auth state
      localStorage.removeItem("authState");
      // Redirect to login if not already there
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
