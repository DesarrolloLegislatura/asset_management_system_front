import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";
import { catalogService } from "../api/catalogService";
import { ticketKeys } from "../constants/queryKeys";
import type {
  PriorityInput,
  ProviderCompanyInput,
  ServiceTypeInput,
  TaskCategoryInput,
} from "../types";

// Catálogos casi estáticos: staleTime largo evita refetch innecesario en
// cada montaje de formulario/lista.
const CATALOG_STALE_TIME = 5 * 60_000;

const invalidateCatalog = (queryClient: QueryClient, name: string) =>
  queryClient.invalidateQueries({ queryKey: ticketKeys.catalog(name) });

// Prioridades
export const usePriorities = () => {
  return useQuery({
    queryKey: ticketKeys.catalog("priorities"),
    queryFn: catalogService.getPriorities,
    staleTime: CATALOG_STALE_TIME,
  });
};

export const useCreatePriority = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: PriorityInput) => catalogService.createPriority(body),
    onSuccess: () => invalidateCatalog(queryClient, "priorities"),
  });
};

export const useUpdatePriority = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: PriorityInput }) =>
      catalogService.updatePriority(id, body),
    onSuccess: () => invalidateCatalog(queryClient, "priorities"),
  });
};

export const useSetPriorityActive = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) =>
      catalogService.setPriorityActive(id, active),
    onSuccess: () => invalidateCatalog(queryClient, "priorities"),
  });
};

export const useDeletePriority = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => catalogService.removePriority(id),
    onSuccess: () => invalidateCatalog(queryClient, "priorities"),
  });
};

// Tipos de servicio
export const useServiceTypes = () => {
  return useQuery({
    queryKey: ticketKeys.catalog("serviceTypes"),
    queryFn: catalogService.getServiceTypes,
    staleTime: CATALOG_STALE_TIME,
  });
};

export const useCreateServiceType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: ServiceTypeInput) =>
      catalogService.createServiceType(body),
    onSuccess: () => invalidateCatalog(queryClient, "serviceTypes"),
  });
};

export const useUpdateServiceType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: ServiceTypeInput }) =>
      catalogService.updateServiceType(id, body),
    onSuccess: () => invalidateCatalog(queryClient, "serviceTypes"),
  });
};

export const useDeleteServiceType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => catalogService.removeServiceType(id),
    onSuccess: () => invalidateCatalog(queryClient, "serviceTypes"),
  });
};

// Categorías de tarea
export const useTaskCategories = () => {
  return useQuery({
    queryKey: ticketKeys.catalog("taskCategories"),
    queryFn: catalogService.getTaskCategories,
    staleTime: CATALOG_STALE_TIME,
  });
};

export const useCreateTaskCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: TaskCategoryInput) =>
      catalogService.createTaskCategory(body),
    onSuccess: () => invalidateCatalog(queryClient, "taskCategories"),
  });
};

export const useUpdateTaskCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: TaskCategoryInput }) =>
      catalogService.updateTaskCategory(id, body),
    onSuccess: () => invalidateCatalog(queryClient, "taskCategories"),
  });
};

export const useDeleteTaskCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => catalogService.removeTaskCategory(id),
    onSuccess: () => invalidateCatalog(queryClient, "taskCategories"),
  });
};

// Empresas proveedoras
export const useProviderCompanies = () => {
  return useQuery({
    queryKey: ticketKeys.catalog("providerCompanies"),
    queryFn: catalogService.getProviderCompanies,
    staleTime: CATALOG_STALE_TIME,
  });
};

export const useCreateProviderCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: ProviderCompanyInput) =>
      catalogService.createProviderCompany(body),
    onSuccess: () => invalidateCatalog(queryClient, "providerCompanies"),
  });
};

export const useUpdateProviderCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: ProviderCompanyInput }) =>
      catalogService.updateProviderCompany(id, body),
    onSuccess: () => invalidateCatalog(queryClient, "providerCompanies"),
  });
};

export const useSetProviderCompanyActive = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) =>
      catalogService.setProviderCompanyActive(id, active),
    onSuccess: () => invalidateCatalog(queryClient, "providerCompanies"),
  });
};

export const useDeleteProviderCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => catalogService.removeProviderCompany(id),
    onSuccess: () => invalidateCatalog(queryClient, "providerCompanies"),
  });
};
