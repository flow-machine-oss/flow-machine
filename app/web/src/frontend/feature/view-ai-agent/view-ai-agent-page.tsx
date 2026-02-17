"use client";

import { Center } from "@/frontend/component/extended-ui/center";
import { Pending } from "@/frontend/component/extended-ui/pending";
import { PlatformPageTemplate } from "@/frontend/component/platform/platform-page-template";
import { ViewAiAgentDetails } from "@/frontend/feature/view-ai-agent/view-ai-agent-details";
import { useGetAiAgent } from "@/frontend/hook/ai-agent/use-get-ai-agent";

type ViewAiAgentPageProps = {
  id: string;
};

export function ViewAiAgentPage({ id }: ViewAiAgentPageProps) {
  const { data, isPending } = useGetAiAgent(id);

  return (
    <PlatformPageTemplate heading={data?.name ?? "AI Agent"}>
      {isPending ? (
        <Center>
          <Pending />
        </Center>
      ) : (
        data && (
          <div className="max-w-2xl space-y-6">
            <ViewAiAgentDetails aiAgent={data} />
          </div>
        )
      )}
    </PlatformPageTemplate>
  );
}
