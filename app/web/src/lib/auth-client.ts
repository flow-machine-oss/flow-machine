import { emailOTPClient, organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { config } from "@/lib/config";

export const authClient = createAuthClient({
  baseURL: config.service.baseUrl + "/api/auth",
  fetchOptions: {
    credentials: "include", // Required for cross-origin cookies
  },
  plugins: [emailOTPClient(), organizationClient()],
});
