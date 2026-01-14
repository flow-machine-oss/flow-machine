"use client";

import { useAuth } from "@/module/auth/hook/use-auth";

export default function Page() {
  const auth = useAuth();
  return <div>{JSON.stringify(auth, null, 4)}</div>;
}
