export const ticketKeys = {
  all: ["tickets"] as const,
  statuses: () => [...ticketKeys.all, "statuses"] as const,
  status: (id: number) => [...ticketKeys.statuses(), id] as const,
};
