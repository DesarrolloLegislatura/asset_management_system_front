import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const initialFilters = {
  fichaNumberFilter: "",
  inventoryFilter: "",
  statusFilter: "all",
  areaFilter: "all",
};

export const useFichaFiltersStore = create()(
  persist(
    (set) => ({
      ...initialFilters,
      setFichaNumberFilter: (fichaNumberFilter) => set({ fichaNumberFilter }),
      setInventoryFilter: (inventoryFilter) => set({ inventoryFilter }),
      setStatusFilter: (statusFilter) => set({ statusFilter }),
      setAreaFilter: (areaFilter) => set({ areaFilter }),
      clearFichaNumberFilter: () =>
        set({ fichaNumberFilter: initialFilters.fichaNumberFilter }),
      clearInventoryFilter: () =>
        set({ inventoryFilter: initialFilters.inventoryFilter }),
      clearStatusFilter: () => set({ statusFilter: initialFilters.statusFilter }),
      clearAreaFilter: () => set({ areaFilter: initialFilters.areaFilter }),
      clearAllFilters: () => set(initialFilters),
    }),
    {
      name: "ficha-filters-storage",
      // sessionStorage: los filtros sobreviven a la navegación y a F5,
      // pero se descartan al cerrar la pestaña.
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        fichaNumberFilter: state.fichaNumberFilter,
        inventoryFilter: state.inventoryFilter,
        statusFilter: state.statusFilter,
        areaFilter: state.areaFilter,
      }),
    }
  )
);
