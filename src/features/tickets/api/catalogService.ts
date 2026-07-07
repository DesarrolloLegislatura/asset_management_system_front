import axiosService from "@/shared/api/axiosService";
import type {
  Priority,
  ProviderCompany,
  ServiceType,
  TaskCategory,
} from "../types";

export const catalogService = {
  getPriorities: async (): Promise<Priority[]> => {
    const { data } = await axiosService.get<Priority[]>("/ticket/priority/");
    return data;
  },

  getServiceTypes: async (): Promise<ServiceType[]> => {
    const { data } = await axiosService.get<ServiceType[]>(
      "/ticket/service_type/"
    );
    return data;
  },

  getTaskCategories: async (): Promise<TaskCategory[]> => {
    const { data } = await axiosService.get<TaskCategory[]>(
      "/ticket/task_category/"
    );
    return data;
  },

  getProviderCompanies: async (): Promise<ProviderCompany[]> => {
    const { data } = await axiosService.get<ProviderCompany[]>(
      "/ticket/provider_company/"
    );
    return data;
  },
};
