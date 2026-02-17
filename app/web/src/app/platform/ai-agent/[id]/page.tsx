import { ViewAiAgentPage } from "@/frontend/feature/view-ai-agent/view-ai-agent-page";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ViewAiAgentPage id={id} />;
}
