import type { Get, Paths, UnknownRecord } from "type-fest";
import z from "zod";

const configPropsSchema = z.object({
  app: z.object({
    env: z.string().default("local"),
    version: z.string().default("0.0.0"),
  }),

  betterAuth: z.object({
    secret: z.string(),
    url: z.url(),
    trustedOrigins: z.string(),
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

type ConfigProps = z.infer<typeof configPropsSchema>;

interface ConfigService<
  T extends UnknownRecord = z.infer<typeof configPropsSchema>,
> {
  get<K extends Paths<T, { leavesOnly: true }> & string>(
    key: K,
  ): Get<T, K, { strict: true }>;
}

export { type ConfigService, type ConfigProps, configPropsSchema };
