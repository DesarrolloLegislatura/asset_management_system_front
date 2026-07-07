import axiosService from "@/shared/api/axiosService";
import type {
  Priority,
  PriorityInput,
  ProviderCompany,
  ProviderCompanyInput,
  ServiceType,
  ServiceTypeInput,
  TaskCategory,
  TaskCategoryInput,
} from "../types";

const PRIORITY_URL = "/ticket/priority/";
const SERVICE_TYPE_URL = "/ticket/service_type/";
const TASK_CATEGORY_URL = "/ticket/task_category/";
const PROVIDER_COMPANY_URL = "/ticket/provider_company/";

export const catalogService = {
  // Prioridades
  getPriorities: async (): Promise<Priority[]> => {
    const { data } = await axiosService.get<Priority[]>(PRIORITY_URL);
    return data;
  },
  getPriorityById: async (id: number): Promise<Priority> => {
    const { data } = await axiosService.get<Priority>(`${PRIORITY_URL}${id}/`);
    return data;
  },
  createPriority: async (body: PriorityInput): Promise<Priority> => {
    const { data } = await axiosService.post<Priority>(PRIORITY_URL, body);
    return data;
  },
  updatePriority: async (id: number, body: PriorityInput): Promise<Priority> => {
    const { data } = await axiosService.put<Priority>(
      `${PRIORITY_URL}${id}/`,
      body
    );
    return data;
  },
  setPriorityActive: async (id: number, active: boolean): Promise<Priority> => {
    const { data } = await axiosService.patch<Priority>(
      `${PRIORITY_URL}${id}/`,
      { active }
    );
    return data;
  },
  removePriority: async (id: number): Promise<void> => {
    await axiosService.delete(`${PRIORITY_URL}${id}/`);
  },

  // Tipos de servicio
  getServiceTypes: async (): Promise<ServiceType[]> => {
    const { data } = await axiosService.get<ServiceType[]>(SERVICE_TYPE_URL);
    return data;
  },
  getServiceTypeById: async (id: number): Promise<ServiceType> => {
    const { data } = await axiosService.get<ServiceType>(
      `${SERVICE_TYPE_URL}${id}/`
    );
    return data;
  },
  createServiceType: async (body: ServiceTypeInput): Promise<ServiceType> => {
    const { data } = await axiosService.post<ServiceType>(
      SERVICE_TYPE_URL,
      body
    );
    return data;
  },
  updateServiceType: async (
    id: number,
    body: ServiceTypeInput
  ): Promise<ServiceType> => {
    const { data } = await axiosService.put<ServiceType>(
      `${SERVICE_TYPE_URL}${id}/`,
      body
    );
    return data;
  },
  removeServiceType: async (id: number): Promise<void> => {
    await axiosService.delete(`${SERVICE_TYPE_URL}${id}/`);
  },

  // Categorías de tarea
  getTaskCategories: async (): Promise<TaskCategory[]> => {
    const { data } = await axiosService.get<TaskCategory[]>(TASK_CATEGORY_URL);
    return data;
  },
  getTaskCategoryById: async (id: number): Promise<TaskCategory> => {
    const { data } = await axiosService.get<TaskCategory>(
      `${TASK_CATEGORY_URL}${id}/`
    );
    return data;
  },
  createTaskCategory: async (body: TaskCategoryInput): Promise<TaskCategory> => {
    const { data } = await axiosService.post<TaskCategory>(
      TASK_CATEGORY_URL,
      body
    );
    return data;
  },
  updateTaskCategory: async (
    id: number,
    body: TaskCategoryInput
  ): Promise<TaskCategory> => {
    const { data } = await axiosService.put<TaskCategory>(
      `${TASK_CATEGORY_URL}${id}/`,
      body
    );
    return data;
  },
  removeTaskCategory: async (id: number): Promise<void> => {
    await axiosService.delete(`${TASK_CATEGORY_URL}${id}/`);
  },

  // Empresas proveedoras
  getProviderCompanies: async (): Promise<ProviderCompany[]> => {
    const { data } = await axiosService.get<ProviderCompany[]>(
      PROVIDER_COMPANY_URL
    );
    return data;
  },
  getProviderCompanyById: async (id: number): Promise<ProviderCompany> => {
    const { data } = await axiosService.get<ProviderCompany>(
      `${PROVIDER_COMPANY_URL}${id}/`
    );
    return data;
  },
  createProviderCompany: async (
    body: ProviderCompanyInput
  ): Promise<ProviderCompany> => {
    const { data } = await axiosService.post<ProviderCompany>(
      PROVIDER_COMPANY_URL,
      body
    );
    return data;
  },
  updateProviderCompany: async (
    id: number,
    body: ProviderCompanyInput
  ): Promise<ProviderCompany> => {
    const { data } = await axiosService.put<ProviderCompany>(
      `${PROVIDER_COMPANY_URL}${id}/`,
      body
    );
    return data;
  },
  setProviderCompanyActive: async (
    id: number,
    active: boolean
  ): Promise<ProviderCompany> => {
    const { data } = await axiosService.patch<ProviderCompany>(
      `${PROVIDER_COMPANY_URL}${id}/`,
      { active }
    );
    return data;
  },
  removeProviderCompany: async (id: number): Promise<void> => {
    await axiosService.delete(`${PROVIDER_COMPANY_URL}${id}/`);
  },
};
