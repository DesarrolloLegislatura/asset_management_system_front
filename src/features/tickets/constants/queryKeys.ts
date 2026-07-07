export const ticketKeys = {
  all: ["tickets"] as const,
  statuses: () => [...ticketKeys.all, "statuses"] as const,
  status: (id: number) => [...ticketKeys.statuses(), id] as const,
  lists: () => [...ticketKeys.all, "list"] as const,
  detail: (id: number) => [...ticketKeys.all, "detail", id] as const,
};
