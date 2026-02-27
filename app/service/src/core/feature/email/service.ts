import type { Result } from "neverthrow";
import z from "zod";
import type { Err } from "@/common/err/err";

const emailServiceInputSchema = {
  send: z.object({
    payload: z.object({
      from: z.string(),
      to: z.email(),
      subject: z.string(),
      bodyHtml: z.string(),
    }),
  }),
};

interface EmailService {
  send(
    input: z.infer<typeof emailServiceInputSchema.send>,
  ): Promise<Result<void, Err>>;
}

export type { EmailService };
