import axiosService from "@/shared/api/axiosService";
import type { TicketStatus, TicketStatusInput } from "../types";

const BASE_URL = "/ticket/ticket_status/";

export const ticketStatusService = {
  getAll: async (): Promise<TicketStatus[]> => {
    const { data } = await axiosService.get<TicketStatus[]>(BASE_URL);
    return data;
  },

  getById: async (id: number): Promise<TicketStatus> => {
    const { data } = await axiosService.get<TicketStatus>(`${BASE_URL}${id}/`);
    return data;
  },

  create: async (body: TicketStatusInput): Promise<TicketStatus> => {
    const { data } = await axiosService.post<TicketStatus>(BASE_URL, body);
    return data;
  },

  update: async (id: number, body: TicketStatusInput): Promise<TicketStatus> => {
    const { data } = await axiosService.put<TicketStatus>(
      `${BASE_URL}${id}/`,
      body
    );
    return data;
  },

  remove: async (id: number): Promise<void> => {
    await axiosService.delete(`${BASE_URL}${id}/`);
  },
};
