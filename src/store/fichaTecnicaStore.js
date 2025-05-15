import { encryptedStorage } from "@/utils/encryptedStorage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
const initialState = {
  fichaSelecionada: {},
};
export const useFichaSeleccionada = create()(
  persist(
    (set, get) => ({
      fichaSelecionada: initialState.fichaSelecionada,
      setfichaSelecionada: (fichaSelecionada) =>
        set((state) => ({ ...state, fichaSelecionada })),
      clearFichaSeleccionada: () =>
        set({ fichaSelecionada: initialState.fichaSelecionada }),
    }),
    {
      name: "ficha-storage",
      storage: createJSONStorage(() => encryptedStorage),
      // storage: encryptedStorage,
    }
  )
);
