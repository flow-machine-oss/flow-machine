"use client";

import { PlusIcon } from "lucide-react";
import Link from "next/link";
import type { AiAgentDomain } from "@/domain/entity/ai-agent/ai-agent-domain-schema";
import { DataTable } from "@/frontend/component/extended-ui/data-table";
import { PlatformPageTemplate } from "@/frontend/component/platform/platform-page-template";
import { Button } from "@/frontend/component/ui/button";
import { makeAiAgentsTableColumnDef } from "@/frontend/feature/ai-agents-table/ai-agents-table-column-def";
import { useDeleteAiAgent } from "@/frontend/hook/ai-agent/use-delete-ai-agent";
import { useListAiAgents } from "@/frontend/hook/ai-agent/use-list-ai-agents";
import { useConfirmableAction } from "@/frontend/hook/use-confirmable-action";

export default function AiAgentsTablePage() {
  const deleteAction = useConfirmableAction();

  const { data, isPending } = useListAiAgents();
  const { mutateAsync, isPending: isDeleteAiAgentPending } = useDeleteAiAgent();

  const handleDeleteAiAgentActionTrigger = deleteAction.triggerAction;
  const handleDeleteAiAgentActionCancel = deleteAction.resetAction;
  const handleDeleteAiAgentActionConfirm = deleteAction.withConfirmableAction(
    async (id: AiAgentDomain["id"]) => {
      await mutateAsync({ params: { id } });
    },
  );

  return (
    <PlatformPageTemplate heading="AI Agent" isPending={isPending}>
      <div className="space-y-2.5">
        <div className="flex w-full justify-end">
          <Button
            nativeButton={false}
            render={(props) => (
              <Link href="/platform/ai-agent/new" {...props} />
            )}
          >
            <PlusIcon />
            New AI Agent
          </Button>
        </div>
        <DataTable
          columns={makeAiAgentsTableColumnDef({
            isDeleteConfirmationAlertOpen:
              deleteAction.step === "confirmation" ||
              deleteAction.step === "inProgress",
            isDeleting:
              deleteAction.step === "inProgress" || isDeleteAiAgentPending,
            onDeleteActionCancel: handleDeleteAiAgentActionCancel,
            onDeleteActionConfirm: handleDeleteAiAgentActionConfirm,
            onDeleteActionTrigger: handleDeleteAiAgentActionTrigger,
          })}
          data={data ?? []}
          searchKey="name"
          searchPlaceholder="Filter AI agents..."
        />
      </div>
    </PlatformPageTemplate>
  );
}
