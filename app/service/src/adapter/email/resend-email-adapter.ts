import { attemptAsync, isNotNil } from "es-toolkit";
import { err, ok } from "neverthrow";
import { Resend } from "resend";
import { config } from "@/common/config/config";
import { Err } from "@/common/err/err";
import type {
  OTPType,
  SendInvitationEmail,
  SendOTPEmail,
} from "@/domain/port/email/email-service";

const resend = new Resend(config.email.apiKey);

export const makeSendOTPEmail =
  (): SendOTPEmail =>
  async ({ email, otp, type }) => {
    const subjects: Record<OTPType, string> = {
      "sign-in": "Your sign-in code",
      "email-verification": "Verify your email",
      "forget-password": "Reset your password",
    };

    const [error] = await attemptAsync(() =>
      resend.emails.send({
        from: config.email.fromAddress,
        to: email,
        subject: subjects[type],
        html: `
        <div>
          <h1>${subjects[type]}</h1>
          <p>Your verification code is:</p>
          <h2 style="font-size: 32px; letter-spacing: 8px;">${otp}</h2>
          <p>This code expires in 5 minutes.</p>
        </div>
      `,
      }),
    );

    if (isNotNil(error)) {
      return err(Err.from(error));
    }
    return ok(undefined);
  };

export const makeSendInvitationEmail =
  (): SendInvitationEmail =>
  async ({ id, email, organizationName, inviterName }) => {
    const inviteLink = `${config.betterAuth.url}/accept-invitation/${id}`;

    const [error] = await attemptAsync(() =>
      resend.emails.send({
        from: config.email.fromAddress,
        to: email,
        subject: `You've been invited to ${organizationName}`,
        html: `
          <div>
            <h1>You've been invited!</h1>
            <p>${inviterName} invited you to join <strong>${organizationName}</strong>.</p>
            <a href="${inviteLink}"
               style="display: inline-block; padding: 12px 24px;
                      background: #000; color: #fff; text-decoration: none;
                      border-radius: 6px; margin-top: 16px;">
              Accept Invitation
            </a>
          </div>
        `,
      }),
    );

    if (isNotNil(error)) {
      return err(Err.from(error));
    }
    return ok(undefined);
  };
