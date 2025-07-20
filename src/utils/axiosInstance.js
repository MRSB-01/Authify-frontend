import axios from "axios";

const instance = axios.create({
  baseURL: 'https://authify-spring-boot-backend.onrender.com/api/v1.0',
  withCredentials: true,
});

export default instance;
