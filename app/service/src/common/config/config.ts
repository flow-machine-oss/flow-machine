import { z } from "zod/v4";

export const configSchema = z.object({
  app: z.object({
    env: z.string().default("local"),
    version: z.string().default("0.0.0"),
  }),

  betterAuth: z.object({
    secret: z.string(),
    url: z.url(),
    trustedOrigins: z.array(z.string()),
  }),

  database: z.object({
    url: z.string(),
    name: z.string(),
  }),

  daytona: z.object({
    apiKey: z.string(),
  }),

  email: z.object({
    apiKey: z.string(),
    fromAddress: z.string().default("Flow Machine <root@email.flowmachine.io>"),
  }),

  billing: z.object({
    autumnSecretKey: z.string(),
  }),

  inngest: z.object({
    eventKey: z.string().optional(),
    signingKey: z.string().optional(),
    isDev: z.boolean().default(true),
    baseUrl: z.url().optional(),
  }),
});

export type Config = z.output<typeof configSchema>;

export const config = configSchema.parse({
  app: {
    env: process.env.APP_ENV,
    version: process.env.APP_VERSION,
  },

  betterAuth: {
    secret: process.env.BETTER_AUTH_SECRET,
    url: process.env.BETTER_AUTH_URL,
    trustedOrigins: process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",") ?? [],
  },

  database: {
    url: process.env.DATABASE_URL,
    name: process.env.DATABASE_NAME,
  },

  daytona: {
    apiKey: process.env.DAYTONA_API_KEY,
  },

  email: {
    apiKey: process.env.RESEND_API_KEY,
    fromAddress: process.env.EMAIL_FROM_ADDRESS,
  },

  billing: {
    autumnSecretKey: process.env.AUTUMN_SECRET_KEY,
  },

  inngest: {
    eventKey: process.env.INNGEST_EVENT_KEY,
    signingKey: process.env.INNGEST_SIGNING_KEY,
    isDev: process.env.INNGEST_DEV === "true",
    baseUrl: process.env.INNGEST_BASE_URL,
  },
});
