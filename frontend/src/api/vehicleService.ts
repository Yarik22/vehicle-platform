import { vehicleServiceApi } from "./client";
import type {
  Vehicle,
  CreateVehicleRequest,
  UpdateVehicleRequest,
} from "../types";

export const vehicleService = {
  getVehicles: async (): Promise<Vehicle[]> => {
    const response = await vehicleServiceApi.get<Vehicle[]>("/vehicles");
    return response.data;
  },

  getVehicleById: async (id: number): Promise<Vehicle> => {
    const response = await vehicleServiceApi.get<Vehicle>(`/vehicles/${id}`);
    return response.data;
  },

  createVehicle: async (
    vehicleData: CreateVehicleRequest
  ): Promise<Vehicle> => {
    const response = await vehicleServiceApi.post<Vehicle>(
      "/vehicles",
      vehicleData
    );
    return response.data;
  },

  updateVehicle: async (
    id: number,
    vehicleData: UpdateVehicleRequest
  ): Promise<Vehicle> => {
    const response = await vehicleServiceApi.put<Vehicle>(
      `/vehicles/${id}`,
      vehicleData
    );
    return response.data;
  },

  deleteVehicle: async (id: number): Promise<void> => {
    await vehicleServiceApi.delete(`/vehicles/${id}`);
  },

  getVehiclesByUserId: async (userId: number): Promise<Vehicle[]> => {
    const response = await vehicleServiceApi.get<Vehicle[]>(
      `/vehicles?user_id=${userId}`
    );
    return response.data;
  },
};
