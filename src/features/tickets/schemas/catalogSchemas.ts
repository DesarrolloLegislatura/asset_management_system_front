import { z } from "zod";

export const prioritySchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  code: z.string().min(1, "El código es obligatorio"),
  active: z.boolean().default(true),
});

export type PriorityFormValues = z.infer<typeof prioritySchema>;

// Compartido por service_type y task_category: ambos solo tienen `name`.
export const simpleCatalogSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
});

export type SimpleCatalogFormValues = z.infer<typeof simpleCatalogSchema>;
