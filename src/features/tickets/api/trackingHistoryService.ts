import axiosService from "@/shared/api/axiosService";
import type { TrackingHistoryEntry, TrackingHistoryInput } from "../types";

const BASE_URL = "/ticket/tracking_history/";

export const trackingHistoryService = {
  getAll: async (): Promise<TrackingHistoryEntry[]> => {
    const { data } = await axiosService.get<TrackingHistoryEntry[]>(BASE_URL);
    return data;
  },

  getById: async (id: number): Promise<TrackingHistoryEntry> => {
    const { data } = await axiosService.get<TrackingHistoryEntry>(
      `${BASE_URL}${id}/`
    );
    return data;
  },

  // El backend no expone un query param de filtro por pedido adicional: se
  // trae todo el listado y se filtra client-side por additional_request.
  getByAdditionalRequest: async (
    additionalRequestId: number
  ): Promise<TrackingHistoryEntry[]> => {
    const all = await trackingHistoryService.getAll();
    return all
      .filter((entry) => entry.additional_request === additionalRequestId)
      .sort((a, b) => {
        const dateA = a.event_date ? new Date(a.event_date).getTime() : 0;
        const dateB = b.event_date ? new Date(b.event_date).getTime() : 0;
        return dateA - dateB;
      });
  },

  create: async (
    body: TrackingHistoryInput
  ): Promise<TrackingHistoryEntry> => {
    const { data } = await axiosService.post<TrackingHistoryEntry>(
      BASE_URL,
      body
    );
    return data;
  },

  update: async (
    id: number,
    body: TrackingHistoryInput
  ): Promise<TrackingHistoryEntry> => {
    const { data } = await axiosService.put<TrackingHistoryEntry>(
      `${BASE_URL}${id}/`,
      body
    );
    return data;
  },

  remove: async (id: number): Promise<void> => {
    await axiosService.delete(`${BASE_URL}${id}/`);
  },
};
