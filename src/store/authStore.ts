// src/store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Role } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null, token?: string) => void;
  setToken: (token: string) => void;
  logout: () => void;
  isAdmin: () => boolean;
  isMember: () => boolean;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setUser: (user, token) => {
        if (token) {
          localStorage.setItem("auth_token", token);
        }
        set({
          user,
          token: token || get().token,
          isAuthenticated: !!user,
        });
      },

      setToken: (token) => {
        localStorage.setItem("auth_token", token);
        set({ token });
      },

      logout: () => {
        localStorage.removeItem("auth_token");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      isAdmin: () => {
        const { user } = get();
        return user?.role === "ADMIN";
      },

      isMember: () => {
        const { user } = get();
        return user?.role === "MEMBER";
      },

      updateUser: (updates) => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, ...updates },
          });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
