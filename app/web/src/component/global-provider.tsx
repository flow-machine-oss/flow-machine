"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { queryClient } from "@/lib/query/query-client";
import { AuthProvider } from "@/module/auth/component/auth-provider";

export function GlobalProvider({ children }: PropsWithChildren) {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AuthProvider>
  );
}
