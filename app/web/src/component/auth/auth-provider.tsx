"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/themes";
import type { PropsWithChildren } from "react";

export function AuthProvider({ children }: PropsWithChildren) {
  return (
    <ClerkProvider
      appearance={{ theme: shadcn }}
      signInFallbackRedirectUrl="/platform"
      signUpFallbackRedirectUrl="/platform"
    >
      {children}
    </ClerkProvider>
  );
}
