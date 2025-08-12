import axios from "axios";
import type { AxiosInstance } from "axios";

const userServiceBaseURL = import.meta.env.VITE_USER_SERVICE_URL;
const vehicleServiceBaseURL = import.meta.env.VITE_VEHICLE_SERVICE_URL;

export const userServiceApi: AxiosInstance = axios.create({
  baseURL: userServiceBaseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const vehicleServiceApi: AxiosInstance = axios.create({
  baseURL: vehicleServiceBaseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

userServiceApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("User Service API Error:", error);
    return Promise.reject(error);
  }
);

userServiceApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

vehicleServiceApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Vehicle Service API Error:", error);
    return Promise.reject(error);
  }
);

vehicleServiceApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
