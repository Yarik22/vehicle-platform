import { userServiceApi } from './client';
import type{ User, CreateUserRequest, UpdateUserRequest, ApiResponse } from '../types';

export const userService = {
  // Получить всех пользователей
  getUsers: async (): Promise<User[]> => {
    const response = await userServiceApi.get<ApiResponse<User[]>>('/users');
    return response.data.data;
  },

  // Получить пользователя по ID
  getUserById: async (id: number): Promise<User> => {
    const response = await userServiceApi.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data;
  },

  // Создать пользователя
  createUser: async (userData: CreateUserRequest): Promise<User> => {
    const response = await userServiceApi.post<ApiResponse<User>>('/users', userData);
    return response.data.data;
  },

  // Обновить пользователя
  updateUser: async (id: number, userData: UpdateUserRequest): Promise<User> => {
    const response = await userServiceApi.put<ApiResponse<User>>(`/users/${id}`, userData);
    return response.data.data;
  },

  // Удалить пользователя
  deleteUser: async (id: number): Promise<void> => {
    await userServiceApi.delete(`/users/${id}`);
  },
}; 