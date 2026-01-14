import { z } from "zod/v4";

export const configSchema = z.object({
  app: z.object({
    env: z.string().default("local"),
    version: z.string().default("0.0.0"),
  }),

  database: z.object({
    url: z.string(),
  }),

  clerk: z.object({
    jwksUrl: z
      .string()
      .default(
        "https://united-raptor-76.clerk.accounts.dev/.well-known/jwks.json",
      ),
    issuer: z.string().default("https://united-raptor-76.clerk.accounts.dev"),
  }),
});

export type Config = z.output<typeof configSchema>;

export const config = configSchema.parse({
  app: {
    env: process.env.APP_ENV,
    version: process.env.APP_VERSION,
  },

  database: {
    url: process.env.DATABASE_URL,
  },

  clerk: {
    jwksUrl: process.env.CLERK_JWKS_URL,
    issuer: process.env.CLERK_ISSUER,
  },
});
