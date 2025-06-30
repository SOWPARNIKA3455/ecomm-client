import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api",
  withCredentials: true, // ✅ needed for cookie-based auth
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const admin = JSON.parse(localStorage.getItem("admin"));
  const isAdminRoute = config.url?.includes('/admin');

  if (isAdminRoute && admin?.token) {
    config.headers.Authorization = `Bearer ${admin.token}`;
  } else if (!isAdminRoute && user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
