import { emailOTPClient, organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { config } from "@/lib/config";

export const authClient = createAuthClient({
  baseURL: config.service.baseUrl + "/api/auth",
  plugins: [emailOTPClient(), organizationClient()],
});
