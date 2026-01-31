import type { PropsWithChildren } from "react";
import { Separator } from "@/component/ui/separator";
import { SidebarTrigger } from "@/component/ui/sidebar";
import { cn } from "@/lib/util";

type PlatformPageTemplate = {
  heading: string;
  paddingDisabled?: boolean;
};

export function PlatformPageTemplate({
  children,
  heading,
  paddingDisabled = false,
}: PropsWithChildren<PlatformPageTemplate>) {
  return (
    <div className="grid h-full w-full grid-rows-[auto_1fr]">
      <header className="border-muted flex shrink-0 items-center gap-1.5 border-b px-4 py-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-4 data-[orientation=vertical]:self-auto"
        />
        <h1 className="ml-1.5 text-sm font-medium tracking-wide">{heading}</h1>
      </header>
      <main
        className={cn(
          "h-full w-full overflow-auto p-4",
          paddingDisabled && "p-0",
        )}
      >
        {children}
      </main>
    </div>
  );
}
