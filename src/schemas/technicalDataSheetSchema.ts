import { z } from "zod";

// Area schema
const AreaSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  telephone: z.string().nullable().optional(),
  active: z.number(),
  createdat: z.string(), // ISO date-time
  updatedat: z.string(), // ISO date-time
});

// Building schema
const BuildingSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable().optional(),
  active: z.number(),
  createdat: z.string(),
  updatedat: z.string(),
});

// Status schema
const StatusSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable().optional(),
  active: z.number(),
  createdat: z.string(),
  updatedat: z.string(),
});

// User schema
const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  first_name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
});

// Asset schema
const AssetSchema = z.object({
  id: z.number(),
  inventory: z.string(),
  surveydate: z.string(),
  invoicenumber: z.string().nullable().optional(),
  serial: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  active: z.number(),
  createdat: z.string(),
  updatedat: z.string(),
  area: AreaSchema.optional(),
  building: BuildingSchema,
  typeasset: z.any(), // Puedes definirlo mejor si tienes el modelo
  situation: z.any(),
  state: z.any(),
  weighting: z.any(),
  user: z.any(),
});

// TechnicalDataSheet schema
export const TechnicalDataSheetSchema = z.object({
  id: z.number(),
  act_simple: z.string().max(200).nullable(),
  year_act_simple: z.number().min(0).max(32767).nullable(),
  user_description: z.string().nullable(),
  tech_description: z.string().nullable(),
  date: z.string().nullable(),
  user_pc: z.string().max(200).nullable(),
  pass_pc: z.string().nullable(),
  contact_name: z.string().max(255).nullable(),
  contact_phone: z.string().max(255).nullable(),
  means_application: z.string().max(255).nullable(),
  assistance: z.string().max(255).nullable(),
  date_in: z.string().nullable(),
  date_out: z.string().nullable(),
  retired_by: z.string().max(255).nullable(),
  active: z.number().min(-2147483648).max(2147483647),
  createdat: z.string(),
  updatedat: z.string(),
  area: AreaSchema,
  building: BuildingSchema,
  asset: AssetSchema,
  status: z.array(StatusSchema),
  users: z.array(UserSchema),
});

export type TechnicalDataSheet = z.infer<typeof TechnicalDataSheetSchema>;
export const TechnicalDataSheetsResponseSchema = z.array(TechnicalDataSheetSchema);
export type TechnicalDataSheetsResponse = z.infer<typeof TechnicalDataSheetsResponseSchema>;
