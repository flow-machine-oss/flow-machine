import { makeBetterAuth } from "@/adapter/auth/better-auth";
import {
  makeGetActiveMember,
  makeGetSession,
} from "@/adapter/auth/better-auth-adapter";
import {
  makeSendInvitationEmail,
  makeSendOTPEmail,
} from "@/adapter/email/resend-email-adapter";
import { makeAuthHttpRouter } from "@/adapter/http/auth/auth-http-router";

const sendOTPEmail = makeSendOTPEmail();
const sendInvitationEmail = makeSendInvitationEmail();

const betterAuth = makeBetterAuth({
  sendOTPEmail,
  sendInvitationEmail,
});

export const getSession = makeGetSession({ betterAuth });
export const getActiveMember = makeGetActiveMember({ betterAuth });

export const authHttpRouter = makeAuthHttpRouter({ betterAuth });
