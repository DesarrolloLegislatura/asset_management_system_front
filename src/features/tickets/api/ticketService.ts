import axiosService from "@/shared/api/axiosService";
import type { Ticket, TicketInput } from "../types";

const BASE_URL = "/ticket/ticket/";

export const ticketService = {
  getAll: async (): Promise<Ticket[]> => {
    const { data } = await axiosService.get<Ticket[]>(BASE_URL);
    return data;
  },

  getById: async (id: number): Promise<Ticket> => {
    const { data } = await axiosService.get<Ticket>(`${BASE_URL}${id}/`);
    return data;
  },

  create: async (body: TicketInput): Promise<Ticket> => {
    const { data } = await axiosService.post<Ticket>(BASE_URL, body);
    return data;
  },

  update: async (id: number, body: TicketInput): Promise<Ticket> => {
    const { data } = await axiosService.put<Ticket>(`${BASE_URL}${id}/`, body);
    return data;
  },

  changeStatus: async (id: number, global_status: number): Promise<Ticket> => {
    const { data } = await axiosService.patch<Ticket>(`${BASE_URL}${id}/`, {
      global_status,
    });
    return data;
  },

  remove: async (id: number): Promise<void> => {
    await axiosService.delete(`${BASE_URL}${id}/`);
  },
};
