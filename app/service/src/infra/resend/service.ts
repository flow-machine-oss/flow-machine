import { err, ok } from "neverthrow";
import { Resend } from "resend";
import { Err } from "@/common/err/err";
import type { EmailService } from "@/core/feature/email/service";

class ResendEmailService implements EmailService {
  #resendClient: Resend;

  constructor(resendClient: Resend) {
    this.#resendClient = resendClient;
  }

  async send(input: Parameters<EmailService["send"]>[0]) {
    const { payload } = input;
    const { from, to, subject, bodyHtml } = payload;

    try {
      await this.#resendClient.emails.send({
        from,
        to,
        subject,
        html: bodyHtml,
      });
      return ok();
    } catch (error) {
      return err(Err.from(error));
    }
  }
}

export { ResendEmailService };
