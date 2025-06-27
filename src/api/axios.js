import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api",
  withCredentials: true,
});


API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdminRoute = config.url?.includes('/admin');

  
  if (user?.token && !isAdminRoute) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
