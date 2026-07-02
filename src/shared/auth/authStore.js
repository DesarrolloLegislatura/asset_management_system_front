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
    (set) => ({
      user: initialState.user,
      setUser: (user) =>
        set((state) => ({ ...state, user: { ...state.user, ...user } })),
      clearAuth: () => set({ user: initialState.user }),
    }),
    {
      name: "auth-storage",
      // sessionStorage síncrono: la rehidratación ocurre antes de que corran
      // los loaders de las rutas, por lo que el token está disponible en el
      // primer render (incluido hard-reload). El almacenamiento en cliente NO
      // es una frontera de seguridad: el backend valida cada petición.
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
