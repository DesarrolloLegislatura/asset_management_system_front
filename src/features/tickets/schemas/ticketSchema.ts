import { z } from "zod";

// Los campos numéricos (FK) viajan como string desde los <Select> del form;
// se convierten a number recién al construir el payload en el submit (igual
// que el resto de formularios del proyecto, ver FichaIngresoForm).
export const ticketSchema = z.object({
  general_title: z.string().min(1, "El título es obligatorio"),
  company: z.string().min(1, "La empresa es obligatoria"),
  external_ticket_number: z.string().optional().default(""),
  simple_action_number: z.string().optional().default(""),
  description: z.string().optional().default(""),
  context: z.string().optional().default(""),
  direct_ticket_url: z.string().optional().default(""),
  external_opening_date: z.string().optional().default(""),
  external_closing_date: z.string().optional().default(""),
  active: z.boolean().default(true),
  category: z.string().optional().default(""),
  service_type: z.string().optional().default(""),
  global_status: z.string().optional().default(""),
  priority: z.string().optional().default(""),
});

export type TicketFormValues = z.infer<typeof ticketSchema>;
