import { z } from "zod";

export const ticketStatusSchema = z.object({
  code: z.string().min(1, "El código es obligatorio"),
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().optional().default(""),
  active: z.boolean().default(true),
});

export type TicketStatusFormValues = z.infer<typeof ticketStatusSchema>;
