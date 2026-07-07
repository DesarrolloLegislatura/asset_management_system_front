import { z } from "zod";

export const additionalRequestSchema = z.object({
  sequence: z.string().min(1, "La secuencia es obligatoria"),
  request_description: z.string().min(1, "La descripción es obligatoria"),
  resolution_description: z.string().optional().default(""),
  request_date: z.string().optional().default(""),
  completion_date: z.string().optional().default(""),
  active: z.boolean().default(true),
  request_status: z.string().optional().default(""),
  priority: z.string().optional().default(""),
  internal_requester: z.string().optional().default(""),
});

export type AdditionalRequestFormValues = z.infer<
  typeof additionalRequestSchema
>;
