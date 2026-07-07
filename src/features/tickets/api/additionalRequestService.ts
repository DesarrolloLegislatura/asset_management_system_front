import axiosService from "@/shared/api/axiosService";
import type { AdditionalRequest, AdditionalRequestInput } from "../types";

const BASE_URL = "/ticket/additional_request/";

export const additionalRequestService = {
  getAll: async (): Promise<AdditionalRequest[]> => {
    const { data } = await axiosService.get<AdditionalRequest[]>(BASE_URL);
    return data;
  },

  getById: async (id: number): Promise<AdditionalRequest> => {
    const { data } = await axiosService.get<AdditionalRequest>(
      `${BASE_URL}${id}/`
    );
    return data;
  },

  // El backend no expone un query param de filtro por ticket: se trae todo
  // el listado y se filtra client-side por parent_ticket.
  getByTicket: async (ticketId: number): Promise<AdditionalRequest[]> => {
    const all = await additionalRequestService.getAll();
    return all.filter((request) => request.parent_ticket === ticketId);
  },

  create: async (body: AdditionalRequestInput): Promise<AdditionalRequest> => {
    const { data } = await axiosService.post<AdditionalRequest>(BASE_URL, body);
    return data;
  },

  update: async (
    id: number,
    body: AdditionalRequestInput
  ): Promise<AdditionalRequest> => {
    const { data } = await axiosService.put<AdditionalRequest>(
      `${BASE_URL}${id}/`,
      body
    );
    return data;
  },

  // PATCH parcial: para actualizar solo un subconjunto de campos (p. ej.
  // marcar `completion_date` o `active`) sin reenviar el objeto completo.
  patch: async (
    id: number,
    body: Partial<AdditionalRequestInput>
  ): Promise<AdditionalRequest> => {
    const { data } = await axiosService.patch<AdditionalRequest>(
      `${BASE_URL}${id}/`,
      body
    );
    return data;
  },

  remove: async (id: number): Promise<void> => {
    await axiosService.delete(`${BASE_URL}${id}/`);
  },
};
