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

export const providerCompanySchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  support_portal_url: z
    .union([z.literal(""), z.string().url("URL inválida")])
    .optional()
    .default(""),
  contact_name: z.string().optional().default(""),
  contact_email: z
    .union([z.literal(""), z.string().email("Email inválido")])
    .optional()
    .default(""),
  active: z.boolean().default(true),
});

export type ProviderCompanyFormValues = z.infer<typeof providerCompanySchema>;
