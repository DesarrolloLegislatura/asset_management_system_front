import type { components } from "@/types/api";

export type TicketStatus = components["schemas"]["TicketStatuses"];

export type TicketStatusInput = Omit<
  TicketStatus,
  "id" | "createdat" | "updatedat"
>;
