import z from "zod";
import { Err } from "@/common/err/err";
import { makeResultSchema } from "@/common/schema/result-schema";

export const otpTypeSchema = z.enum([
  "sign-in",
  "email-verification",
  "forget-password",
]);
export type OTPType = z.output<typeof otpTypeSchema>;

export const sendOTPEmailSchema = z.function({
  input: [
    z.object({
      email: z.email(),
      otp: z.string(),
      type: otpTypeSchema,
    }),
  ],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type SendOTPEmail = z.output<typeof sendOTPEmailSchema>;

export const sendInvitationEmailSchema = z.function({
  input: [
    z.object({
      id: z.string(),
      email: z.email(),
      organizationName: z.string(),
      inviterName: z.string(),
    }),
  ],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type SendInvitationEmail = z.output<typeof sendInvitationEmailSchema>;
