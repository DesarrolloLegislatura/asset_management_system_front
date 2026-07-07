import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ticketStatusService } from "../api/ticketStatusService";
import { ticketKeys } from "../constants/queryKeys";
import type { TicketStatusInput } from "../types";

export const useTicketStatuses = () => {
  return useQuery({
    queryKey: ticketKeys.statuses(),
    queryFn: ticketStatusService.getAll,
  });
};

export const useTicketStatus = (id: number) => {
  return useQuery({
    queryKey: ticketKeys.status(id),
    queryFn: () => ticketStatusService.getById(id),
    enabled: !!id,
  });
};

export const useCreateTicketStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: TicketStatusInput) => ticketStatusService.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.statuses() });
    },
  });
};

export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: TicketStatusInput }) =>
      ticketStatusService.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.statuses() });
    },
  });
};

export const useSetTicketStatusActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) =>
      ticketStatusService.setActive(id, active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.statuses() });
    },
  });
};

export const useDeleteTicketStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ticketStatusService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.statuses() });
    },
  });
};
