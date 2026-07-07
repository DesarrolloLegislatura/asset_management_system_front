import type { components } from "@/types/api";

export type TicketStatus = components["schemas"]["TicketStatuses"];

export type TicketStatusInput = Omit<
  TicketStatus,
  "id" | "createdat" | "updatedat"
>;

export type Ticket = components["schemas"]["ExternalTickets"];

export type TicketInput = Omit<Ticket, "id" | "createdat" | "updatedat">;

// Catálogos referenciados por Ticket vía FK (id numérico). Solo tipos: los
// servicios/hooks de estos recursos quedan fuera de alcance de esta feature.
export type Priority = components["schemas"]["Priorities"];
export type ServiceType = components["schemas"]["ServiceTypes"];
export type TaskCategory = components["schemas"]["TaskCategories"];
export type ProviderCompany = components["schemas"]["ProviderCompanies"];

export type AdditionalRequest = components["schemas"]["AdditionalRequests"];

export type AdditionalRequestInput = Omit<
  AdditionalRequest,
  "id" | "createdat" | "updatedat"
>;

export type TrackingHistoryEntry = components["schemas"]["TrackingHistory"];
