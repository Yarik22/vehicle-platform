import axios from 'axios';
import type { AxiosInstance } from 'axios';

// Создаем отдельные экземпляры для каждого сервиса
export const userServiceApi: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3001', // User Service порт
  headers: {
    'Content-Type': 'application/json',
  },
});

export const vehicleServiceApi: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3002', // Vehicle Service порт
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцепторы для обработки ошибок
userServiceApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('User Service API Error:', error);
    return Promise.reject(error);
  }
);

vehicleServiceApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Vehicle Service API Error:', error);
    return Promise.reject(error);
  }
); 