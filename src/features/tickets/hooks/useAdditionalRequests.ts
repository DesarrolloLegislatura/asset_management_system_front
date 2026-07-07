import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { additionalRequestService } from "../api/additionalRequestService";
import { ticketKeys } from "../constants/queryKeys";
import type { AdditionalRequestInput } from "../types";

export const useAdditionalRequestsByTicket = (ticketId: number) => {
  return useQuery({
    queryKey: ticketKeys.additionalRequests(ticketId),
    queryFn: () => additionalRequestService.getByTicket(ticketId),
    enabled: !!ticketId,
  });
};

export const useAdditionalRequest = (id: number) => {
  return useQuery({
    queryKey: ticketKeys.additionalRequest(id),
    queryFn: () => additionalRequestService.getById(id),
    enabled: !!id,
  });
};

export const useCreateAdditionalRequest = (ticketId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: AdditionalRequestInput) =>
      additionalRequestService.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ticketKeys.additionalRequests(ticketId),
      });
    },
  });
};

export const useUpdateAdditionalRequest = (ticketId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: AdditionalRequestInput;
    }) => additionalRequestService.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ticketKeys.additionalRequests(ticketId),
      });
    },
  });
};

export const usePatchAdditionalRequest = (ticketId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: Partial<AdditionalRequestInput>;
    }) => additionalRequestService.patch(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ticketKeys.additionalRequests(ticketId),
      });
    },
  });
};

export const useDeleteAdditionalRequest = (ticketId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => additionalRequestService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ticketKeys.additionalRequests(ticketId),
      });
    },
  });
};
