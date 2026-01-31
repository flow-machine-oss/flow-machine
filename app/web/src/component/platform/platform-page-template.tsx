import type { PropsWithChildren } from "react";
import { Separator } from "@/component/ui/separator";
import { SidebarTrigger } from "@/component/ui/sidebar";

type PlatformPageTemplate = {
  heading: string;
};

export function PlatformPageTemplate({
  children,
  heading,
}: PropsWithChildren<PlatformPageTemplate>) {
  return (
    <div className="grid h-full w-full grid-rows-[auto_1fr]">
      <header className="flex shrink-0 items-center gap-1.5 px-4 py-3">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-4 data-[orientation=vertical]:self-auto"
        />
        <h1 className="ml-1.5 text-sm font-medium tracking-wide">{heading}</h1>
      </header>
      <main className="h-full w-full overflow-auto px-4 pb-4">{children}</main>
    </div>
  );
}
