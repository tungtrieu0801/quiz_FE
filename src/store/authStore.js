import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      // Lưu thông tin đăng nhập
      setAuth: (token, user) => set({ token, user }),

      // Xoá thông tin khi logout
      clearAuth: () => set({ token: null, user: null }),
    }),
    {
      name: "auth-storage", // key lưu trong localStorage
      getStorage: () => localStorage, // mặc định là localStorage
    }
  )
);
