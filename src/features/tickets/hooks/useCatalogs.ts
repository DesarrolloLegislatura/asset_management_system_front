import { useQuery } from "@tanstack/react-query";
import { catalogService } from "../api/catalogService";
import { ticketKeys } from "../constants/queryKeys";

// Catálogos casi estáticos: staleTime largo evita refetch innecesario en
// cada montaje de formulario/lista.
const CATALOG_STALE_TIME = 5 * 60_000;

export const usePriorities = () => {
  return useQuery({
    queryKey: ticketKeys.catalog("priorities"),
    queryFn: catalogService.getPriorities,
    staleTime: CATALOG_STALE_TIME,
  });
};

export const useServiceTypes = () => {
  return useQuery({
    queryKey: ticketKeys.catalog("serviceTypes"),
    queryFn: catalogService.getServiceTypes,
    staleTime: CATALOG_STALE_TIME,
  });
};

export const useTaskCategories = () => {
  return useQuery({
    queryKey: ticketKeys.catalog("taskCategories"),
    queryFn: catalogService.getTaskCategories,
    staleTime: CATALOG_STALE_TIME,
  });
};

export const useProviderCompanies = () => {
  return useQuery({
    queryKey: ticketKeys.catalog("providerCompanies"),
    queryFn: catalogService.getProviderCompanies,
    staleTime: CATALOG_STALE_TIME,
  });
};
