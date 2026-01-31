import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { emailOTP, organization } from "better-auth/plugins";
import { config } from "@/common/config/config";
import { newEntityId } from "@/common/domain/entity-id";
import { mongoClient } from "@/common/mongo/mongo-client";
import type {
  SendInvitationEmail,
  SendOTPEmail,
} from "@/domain/port/email/email-service";

const db = mongoClient.db(config.database.name);

type Input = {
  sendOTPEmail: SendOTPEmail;
  sendInvitationEmail: SendInvitationEmail;
};

export const makeBetterAuth = ({ sendOTPEmail, sendInvitationEmail }: Input) =>
  betterAuth({
    secret: config.betterAuth.secret,
    baseURL: config.betterAuth.url,
    trustedOrigins: config.betterAuth.trustedOrigins,

    database: mongodbAdapter(db, { client: mongoClient }),

    emailAndPassword: { enabled: false },

    plugins: [
      emailOTP({
        otpLength: 6,
        expiresIn: 300,
        async sendVerificationOTP({ email, otp, type }) {
          const result = await sendOTPEmail({ email, otp, type });
          if (result.isErr()) {
            throw result.error;
          }
        },
      }),

      organization({
        async sendInvitationEmail(data) {
          const result = await sendInvitationEmail({
            id: data.id,
            email: data.email,
            organizationName: data.organization.name,
            inviterName: data.inviter.user.name ?? data.inviter.user.email,
          });
          if (result.isErr()) {
            throw result.error;
          }
        },
      }),
    ],

    advanced: {
      database: {
        generateId: () => newEntityId(),
      },
    },
  });

export type BetterAuthInstance = ReturnType<typeof makeBetterAuth>;
