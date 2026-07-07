import { z } from "zod";

// `additional_request` no lo completa el usuario: lo inyecta el componente
// (id del pedido cuyo historial se está editando) al construir el payload.
export const trackingEntrySchema = z.object({
  event_date: z.string().optional().default(""),
  update_source: z.string().optional().default(""),
  comment: z.string().optional().default(""),
  previous_status: z.string().optional().default(""),
  new_status: z.string().min(1, "El nuevo estado es obligatorio"),
  active: z.boolean().default(true),
});

export type TrackingEntryFormValues = z.infer<typeof trackingEntrySchema>;
