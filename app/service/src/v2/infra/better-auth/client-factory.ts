import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import {
  type EmailOTPOptions,
  emailOTP,
  organization,
} from "better-auth/plugins";
import { config } from "@/common/config/config";
import { newEntityId } from "@/common/domain/entity-id";
import { mongoClient } from "@/common/mongo/mongo-client";
import type { EmailService } from "@/v2/core/feature/email/service";

const otpTypeToEmailSubject = {
  "sign-in": "Your sign-in code",
  "email-verification": "Verify your email",
  "forget-password": "Reset your password",
} as const;

class BetterAuthClientFactory {
  #emailService: EmailService;

  constructor(emailService: EmailService) {
    this.#emailService = emailService;
  }

  make() {
    return betterAuth({
      secret: config.betterAuth.secret,
      baseURL: config.betterAuth.url,
      trustedOrigins: config.betterAuth.trustedOrigins,

      database: mongodbAdapter(mongoClient.db(config.database.name), {
        client: mongoClient,
      }),

      emailAndPassword: { enabled: false },

      plugins: [
        emailOTP({
          otpLength: 6,
          expiresIn: 300,
          sendVerificationOTP: async (data) => {
            const result = await this.#sendOtpEmail(data);
            if (result.isErr()) {
              throw result.error;
            }
          },
        }),

        organization({
          sendInvitationEmail: async (data) => {
            const result = await this.#sendInvitationEmail({
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
  }

  async #sendOtpEmail(
    body: Parameters<EmailOTPOptions["sendVerificationOTP"]>[0],
  ) {
    return await this.#emailService.send({
      payload: {
        from: config.email.fromAddress,
        to: body.email,
        subject: otpTypeToEmailSubject[body.type],
        bodyHtml: `
        <div>
          <h1>${otpTypeToEmailSubject[body.type]}</h1>
          <p>Your verification code is:</p>
          <h2 style="font-size: 32px; letter-spacing: 8px;">${body.otp}</h2>
          <p>This code expires in 5 minutes.</p>
        </div>
      `,
      },
    });
  }

  async #sendInvitationEmail(data: {
    id: string;
    email: string;
    organizationName: string;
    inviterName: string;
  }) {
    return this.#emailService.send({
      payload: {
        from: config.email.fromAddress,
        to: data.email,
        subject: `You've been invited to ${data.organizationName}`,
        bodyHtml: `
          <div>
            <h1>You've been invited!</h1>
            <p>${data.inviterName} invited you to join <strong>${data.organizationName}</strong>.</p>
            <a href="${config.betterAuth.url}/accept-invitation/${data.id}"
               style="display: inline-block; padding: 12px 24px;
                      background: #000; color: #fff; text-decoration: none;
                      border-radius: 6px; margin-top: 16px;">
              Accept Invitation
            </a>
          </div>
        `,
      },
    });
  }
}

export { BetterAuthClientFactory };
