import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { trackingHistoryService } from "../api/trackingHistoryService";
import { ticketKeys } from "../constants/queryKeys";
import type { TrackingHistoryInput } from "../types";

export const useTrackingHistory = (additionalRequestId: number) => {
  return useQuery({
    queryKey: ticketKeys.trackingHistory(additionalRequestId),
    queryFn: () =>
      trackingHistoryService.getByAdditionalRequest(additionalRequestId),
    enabled: !!additionalRequestId,
  });
};

export const useCreateTrackingEntry = (additionalRequestId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: TrackingHistoryInput) =>
      trackingHistoryService.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ticketKeys.trackingHistory(additionalRequestId),
      });
    },
  });
};

export const useUpdateTrackingEntry = (additionalRequestId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: TrackingHistoryInput;
    }) => trackingHistoryService.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ticketKeys.trackingHistory(additionalRequestId),
      });
    },
  });
};

export const useDeleteTrackingEntry = (additionalRequestId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => trackingHistoryService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ticketKeys.trackingHistory(additionalRequestId),
      });
    },
  });
};
