import { userServiceApi } from "./client";
import type { User, CreateUserRequest, UpdateUserRequest } from "../types";

export const userService = {
  getUsers: async (): Promise<User[]> => {
    const response = await userServiceApi.get<User[]>("/users");
    return response.data;
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await userServiceApi.get<User>(`/users/${id}`);
    return response.data;
  },

  createUser: async (userData: CreateUserRequest): Promise<User> => {
    const response = await userServiceApi.post<User>("/users", userData);
    return response.data;
  },

  updateUser: async (
    id: number,
    userData: UpdateUserRequest
  ): Promise<User> => {
    const response = await userServiceApi.put<User>(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await userServiceApi.delete(`/users/${id}`);
  },

  login: async (
    email: string,
    password: string
  ): Promise<{ token: string; user: User }> => {
    const response = await userServiceApi.post<{ token: string; user: User }>(
      "/login",
      {
        email,
        password,
      }
    );
    return response.data;
  },
};
