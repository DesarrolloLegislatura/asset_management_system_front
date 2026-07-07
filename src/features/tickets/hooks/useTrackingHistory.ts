import { useQuery } from "@tanstack/react-query";
import { trackingHistoryService } from "../api/trackingHistoryService";
import { ticketKeys } from "../constants/queryKeys";

export const useTrackingHistory = (additionalRequestId: number) => {
  return useQuery({
    queryKey: ticketKeys.trackingHistory(additionalRequestId),
    queryFn: () =>
      trackingHistoryService.getByAdditionalRequest(additionalRequestId),
    enabled: !!additionalRequestId,
  });
};
