import api from "./axios";
import { User } from "../types";

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message?: string;
}

export const loginApi = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", { email, password });
  return response.data;
};

export const getMeApi = async (): Promise<{ success: boolean; data: User }> => {
  const response = await api.get<{ success: boolean; data: User }>("/auth/me");
  return response.data;
};

