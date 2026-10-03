import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ==========================================
// ATTACH JWT TO EVERY REQUEST
// ==========================================

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");

    if (token) {
      config.headers = config.headers || {};

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
