import { z } from "zod/v4";

const globalConfigSchema = z.object({
  app: z.object({
    env: z.enum(["production", "staging"]).default("staging"),
    version: z.string().default("local"),
  }),

  service: z.object({
    baseUrl: z.string().default("http://localhost:3000/api"),
  }),
});

export const globalConfig = globalConfigSchema.parse({
  app: {
    env: process.env.APP_ENV,
    version: process.env.APP_VERSION,
  },

  service: {
    baseUrl: process.env.NEXT_PUBLIC_SERVICE_BASE_URL,
  },
});
