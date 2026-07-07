export { ticketsRoutes } from "./routes";
export {
  useTicketStatuses,
  useTicketStatus,
  useCreateTicketStatus,
  useUpdateTicketStatus,
  useDeleteTicketStatus,
} from "./hooks/useTicketStatuses";
export {
  useTickets,
  useTicket,
  useCreateTicket,
  useUpdateTicket,
  useChangeTicketStatus,
  useDeleteTicket,
} from "./hooks/useTickets";
export {
  usePriorities,
  useCreatePriority,
  useUpdatePriority,
  useSetPriorityActive,
  useDeletePriority,
  useServiceTypes,
  useCreateServiceType,
  useUpdateServiceType,
  useDeleteServiceType,
  useTaskCategories,
  useCreateTaskCategory,
  useUpdateTaskCategory,
  useDeleteTaskCategory,
  useProviderCompanies,
  useCreateProviderCompany,
  useUpdateProviderCompany,
  useSetProviderCompanyActive,
  useDeleteProviderCompany,
} from "./hooks/useCatalogs";
export {
  useAdditionalRequestsByTicket,
  useCreateAdditionalRequest,
  useUpdateAdditionalRequest,
  useDeleteAdditionalRequest,
} from "./hooks/useAdditionalRequests";
export { useTrackingHistory } from "./hooks/useTrackingHistory";
export type {
  TicketStatus,
  TicketStatusInput,
  Ticket,
  TicketInput,
  Priority,
  PriorityInput,
  ServiceType,
  ServiceTypeInput,
  TaskCategory,
  TaskCategoryInput,
  ProviderCompany,
  ProviderCompanyInput,
  AdditionalRequest,
  AdditionalRequestInput,
  TrackingHistoryEntry,
} from "./types";
