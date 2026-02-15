import type { PropsWithChildren } from "react";
import { PlatformLayout } from "@/frontend/component/platform/platform-layout";

export default function Layout({ children }: PropsWithChildren) {
  return <PlatformLayout>{children}</PlatformLayout>;
}
