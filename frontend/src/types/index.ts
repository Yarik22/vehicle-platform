export interface User {
  id: number;
  email: string;
  name: string;
  created_at?: string;
}

export interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  user_id: number;
  user?: User;
  created_at?: string;
}

export interface CreateUserRequest {
  email: string;
  name?: string;
  password: string;
}

export interface UpdateUserRequest {
  email?: string;
  name?: string;
  password?: string;
}

export interface CreateVehicleRequest {
  make: string;
  model: string;
  year: number;
  user_id: number;
}

export interface UpdateVehicleRequest {
  make?: string;
  model?: string;
  year?: number;
  user_id?: number;
}
