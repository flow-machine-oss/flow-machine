import { get } from "es-toolkit/compat";
import type { Get, Paths } from "type-fest";
import {
  type ConfigProps,
  type ConfigService,
  configPropsSchema,
} from "@/core/infra/config/service";

const envConfigProps = configPropsSchema.parse({
  app: {
    env: process.env.APP_ENV,
    version: process.env.APP_VERSION,
  },

  betterAuth: {
    secret: process.env.BETTER_AUTH_SECRET,
    url: process.env.BETTER_AUTH_URL,
    trustedOrigins: process.env.BETTER_AUTH_TRUSTED_ORIGINS,
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

class EnvConfigService implements ConfigService<ConfigProps> {
  get<K extends Paths<ConfigProps, { leavesOnly: true }> & string>(key: K) {
    return get(envConfigProps, key) as Get<ConfigProps, K, { strict: true }>;
  }
}

export { EnvConfigService };
