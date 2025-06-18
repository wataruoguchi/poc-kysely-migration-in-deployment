import { z } from "zod";

const envSchema = z.object({
  PGHOST: z.string(),
  PGPORT: z.coerce.number(),
  PGDATABASE: z.string(),
  PGUSER: z.string(),
  PGPASSWORD: z.string(),
  PORT: z.coerce.number(),
});

export type Env = z.infer<typeof envSchema>;
export const env = envSchema.parse(process.env);
