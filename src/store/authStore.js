import { encryptedStorage } from "@/utils/encryptedStorage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const initialState = {
  user: {
    id: null,
    username: null,
    first_name: null,
    last_name: null,
    token: null,
    refreshToken: null,
    groups: [],
    group: null,
  },
};

export const useAuthStore = create()(
  persist(
    // eslint-disable-next-line no-unused-vars
    (set, _get) => ({
      user: initialState.user,
      setUser: (user) => set((state) => ({ ...state, user: { ...state.user, ...user } })),
      clearAuth: () => set({ user: initialState.user }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => encryptedStorage),
      // storage: encryptedStorage,
    }
  )
);
