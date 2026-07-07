import type { components } from "@/types/api";

export type TicketStatus = components["schemas"]["TicketStatuses"];

export type TicketStatusInput = Omit<
  TicketStatus,
  "id" | "createdat" | "updatedat"
>;

export type Ticket = components["schemas"]["ExternalTickets"];

export type TicketInput = Omit<Ticket, "id" | "createdat" | "updatedat">;

// Catálogos referenciados por Ticket vía FK (id numérico).
export type Priority = components["schemas"]["Priorities"];
export type PriorityInput = Omit<Priority, "id" | "createdat" | "updatedat">;

export type ServiceType = components["schemas"]["ServiceTypes"];
export type ServiceTypeInput = Omit<ServiceType, "id">;

export type TaskCategory = components["schemas"]["TaskCategories"];
export type TaskCategoryInput = Omit<TaskCategory, "id">;

export type ProviderCompany = components["schemas"]["ProviderCompanies"];
export type ProviderCompanyInput = Omit<
  ProviderCompany,
  "id" | "createdat" | "updatedat"
>;

export type AdditionalRequest = components["schemas"]["AdditionalRequests"];

export type AdditionalRequestInput = Omit<
  AdditionalRequest,
  "id" | "createdat" | "updatedat"
>;

export type TrackingHistoryEntry = components["schemas"]["TrackingHistory"];
