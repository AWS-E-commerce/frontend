import { axiosInstance } from "../axios.config";
import { ENDPOINTS } from "../endpoints";
import type { LoginRequest, RegisterRequest, AccountResponse } from "@/types";

export const authService = {
  login: async (credentials: LoginRequest): Promise<AccountResponse> => {
    console.log("Called authService login with:", credentials);
    const response = await axiosInstance.post<AccountResponse>(
      ENDPOINTS.AUTH.LOGIN,
      credentials,
    );
    console.log("Login response:", response);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<{ message: string }> => {
    const response = await axiosInstance.post(ENDPOINTS.AUTH.REGISTER, data);
    return { message: response.data || "Register successfully" };
  },

  logout: () => {
    // Just clear local storage, no API call needed
    localStorage.removeItem("auth_token");
  },
};
