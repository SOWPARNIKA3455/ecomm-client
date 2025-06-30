// src/api/axios.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://mern-backend-98xl.onrender.com/api",
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const admin = JSON.parse(localStorage.getItem("admin"));
  const isAdminRoute = config.url?.includes('/admin');

  // ✅ Send correct token depending on route
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
