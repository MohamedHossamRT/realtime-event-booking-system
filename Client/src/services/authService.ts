/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/axios";
import { ApiResponse, User } from "@/types/api";

// DTOs
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
}

export const AuthService = {
  login: async (creds: LoginCredentials) => {
    const response = await api.post<any, ApiResponse<AuthResponse>>(
      // POST /users/login
      "/users/login",
      creds
    );
    return response;
  },

  register: async (creds: RegisterCredentials) => {
    const response = await api.post<any, ApiResponse<AuthResponse>>(
      // POST /users/signup
      "/users/signup",
      creds
    );
    return response;
  },
};
