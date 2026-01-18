"use client";

import { useAuth } from "@clerk/nextjs";

export default function Page() {
  const auth = useAuth();
  return <div>{JSON.stringify(auth, null, 4)}</div>;
}
