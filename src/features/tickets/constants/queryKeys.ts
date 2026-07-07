export const ticketKeys = {
  all: ["tickets"] as const,
  statuses: () => [...ticketKeys.all, "statuses"] as const,
  status: (id: number) => [...ticketKeys.statuses(), id] as const,
  lists: () => [...ticketKeys.all, "list"] as const,
  detail: (id: number) => [...ticketKeys.all, "detail", id] as const,
  catalog: (name: string) => [...ticketKeys.all, "catalog", name] as const,
  additionalRequests: (ticketId: number) =>
    [...ticketKeys.all, "additionalRequests", ticketId] as const,
  additionalRequest: (id: number) =>
    [...ticketKeys.all, "additionalRequest", id] as const,
  trackingHistory: (additionalRequestId: number) =>
    [...ticketKeys.all, "trackingHistory", additionalRequestId] as const,
};
