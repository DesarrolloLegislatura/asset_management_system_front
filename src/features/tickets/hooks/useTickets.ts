import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ticketService } from "../api/ticketService";
import { ticketKeys } from "../constants/queryKeys";
import type { TicketInput } from "../types";

export const useTickets = () => {
  return useQuery({
    queryKey: ticketKeys.lists(),
    queryFn: ticketService.getAll,
  });
};

export const useTicket = (id: number) => {
  return useQuery({
    queryKey: ticketKeys.detail(id),
    queryFn: () => ticketService.getById(id),
    enabled: !!id,
  });
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: TicketInput) => ticketService.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
    },
  });
};

export const useUpdateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: TicketInput }) =>
      ticketService.update(id, body),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(id) });
    },
  });
};

export const useChangeTicketStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      globalStatus,
    }: {
      id: number;
      globalStatus: number;
    }) => ticketService.changeStatus(id, globalStatus),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(id) });
    },
  });
};

export const useDeleteTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ticketService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
    },
  });
};
