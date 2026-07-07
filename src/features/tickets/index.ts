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
export type {
  TicketStatus,
  TicketStatusInput,
  Ticket,
  TicketInput,
  Priority,
  ServiceType,
  TaskCategory,
  ProviderCompany,
} from "./types";
