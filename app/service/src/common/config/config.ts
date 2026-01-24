import { z } from "zod/v4";

export const configSchema = z.object({
  app: z.object({
    env: z.string().default("local"),
    version: z.string().default("0.0.0"),
  }),

  clerk: z.object({
    jwksUrl: z.string(),
    issuer: z.string(),
  }),

  database: z.object({
    url: z.string(),
    name: z.string(),
  }),

  daytona: z.object({
    apiKey: z.string(),
  }),
});

export type Config = z.output<typeof configSchema>;

export const config = configSchema.parse({
  app: {
    env: process.env.APP_ENV,
    version: process.env.APP_VERSION,
  },

  clerk: {
    jwksUrl: process.env.CLERK_JWKS_URL,
    issuer: process.env.CLERK_ISSUER,
  },

  database: {
    url: process.env.DATABASE_URL,
    name: process.env.DATABASE_NAME,
  },

  daytona: {
    apiKey: process.env.DAYTONA_API_KEY,
  },
});
