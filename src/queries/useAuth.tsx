import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/api/services/auth.service";
import { useAuthStore } from "@/store/authStore";
import type { LoginRequest, RegisterRequest, User } from "@/types";
import { useUIStore } from "@/store/uiStore";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const addToast = useUIStore((state) => state.addToast);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (data) => {
      setUser(
        {
          name: data.name,
          username: data.username,
          email: data.email,
          phone: data.phone,
          role: data.role,
          address: data.address,
          avatarUrl: data.avatarUrl,
        },
        data.token,
      );

      addToast({
        message: "Login successful!",
        type: "success",
      });

      // Redirect based on role
      if (data.role === "ADMIN") {
        navigate("/admin/products");
      } else {
        navigate("/");
      }
    },
    onError: (error: any) => {
      addToast({
        message:
          error.response?.data?.message ||
          "Login failed. Please check your credentials.",
        type: "error",
      });
    },
  });
};

export const useRegister = () => {
  const addToast = useUIStore((state) => state.addToast);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: () => {
      addToast({
        message: "Registration successful! Please login.",
        type: "success",
      });
      navigate("/auth/login");
    },
    onError: (error: any) => {
      addToast({
        message:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
        type: "error",
      });
    },
  });
};

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => {
      authService.logout();
      return Promise.resolve();
    },
    onSuccess: () => {
      logout();
      queryClient.clear();
      addToast({
        message: "Logged out successfully",
        type: "success",
      });
      navigate("/auth/login");
    },
  });
};
