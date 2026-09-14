import { create } from "zustand";
import { User } from "../types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

const storedToken = localStorage.getItem("token");
let storedUser: User | null = null;
try {
  const userJson = localStorage.getItem("user");
  if (userJson) storedUser = JSON.parse(userJson);
} catch {
  storedUser = null;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: storedUser,
  token: storedToken,
  isAuthenticated: !!storedToken,
  setAuth: (user: User, token: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
