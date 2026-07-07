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
  useServiceTypes,
  useTaskCategories,
  useProviderCompanies,
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
  ServiceType,
  TaskCategory,
  ProviderCompany,
  AdditionalRequest,
  AdditionalRequestInput,
  TrackingHistoryEntry,
} from "./types";
