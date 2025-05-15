import { encryptedStorage } from "@/utils/encryptedStorage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
const initialState = {
  user: {
    id: null,
    username: null,
    token: null,
    group: null,
  },
};
export const useAuthStore = create()(
  persist(
    (set, get) => ({
      user: initialState.user,
      setUser: (user) => set((state) => ({ ...state, user })),
      clearAuth: () => set({ user: initialState.user }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => encryptedStorage),
      // storage: encryptedStorage,
    }
  )
);
