import { vehicleServiceApi } from './client';
import type { Vehicle, CreateVehicleRequest, UpdateVehicleRequest, ApiResponse } from '../types';

export const vehicleService = {
  // Получить все транспортные средства
  getVehicles: async (): Promise<Vehicle[]> => {
    const response = await vehicleServiceApi.get<ApiResponse<Vehicle[]>>('/vehicles');
    return response.data.data;
  },

  // Получить транспортное средство по ID
  getVehicleById: async (id: number): Promise<Vehicle> => {
    const response = await vehicleServiceApi.get<ApiResponse<Vehicle>>(`/vehicles/${id}`);
    return response.data.data;
  },

  // Создать транспортное средство
  createVehicle: async (vehicleData: CreateVehicleRequest): Promise<Vehicle> => {
    const response = await vehicleServiceApi.post<ApiResponse<Vehicle>>('/vehicles', vehicleData);
    return response.data.data;
  },

  // Обновить транспортное средство
  updateVehicle: async (id: number, vehicleData: UpdateVehicleRequest): Promise<Vehicle> => {
    const response = await vehicleServiceApi.put<ApiResponse<Vehicle>>(`/vehicles/${id}`, vehicleData);
    return response.data.data;
  },

  // Удалить транспортное средство
  deleteVehicle: async (id: number): Promise<void> => {
    await vehicleServiceApi.delete(`/vehicles/${id}`);
  },

  // Получить транспортные средства пользователя
  getVehiclesByUserId: async (userId: number): Promise<Vehicle[]> => {
    const response = await vehicleServiceApi.get<ApiResponse<Vehicle[]>>(`/vehicles?user_id=${userId}`);
    return response.data.data;
  },
}; 