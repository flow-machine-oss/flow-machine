"use client";

import { PlusIcon } from "lucide-react";
import Link from "next/link";
import type { WorkflowDefinitionDomain } from "@/domain/entity/workflow-definition/workflow-definition-domain-schema";
import { DataTable } from "@/frontend/component/extended-ui/data-table";
import { PlatformPageTemplate } from "@/frontend/component/platform/platform-page-template";
import { Button } from "@/frontend/component/ui/button";
import { makeWorkflowDefinitionsTableColumnDef } from "@/frontend/feature/workflow-definitions-table/workflow-definitions-table-column-def";
import { useConfirmableAction } from "@/frontend/hook/use-confirmable-action";
import { useDeleteWorkflowDefinition } from "@/frontend/hook/workflow-definition/use-delete-workflow-definition";
import { useListWorkflowDefinitions } from "@/frontend/hook/workflow-definition/use-list-workflow-definitions";

export default function WorkflowDefinitionsTablePage() {
  const deleteAction = useConfirmableAction();

  const { data, isPending } = useListWorkflowDefinitions();
  const { mutateAsync, isPending: isDeleteWorkflowDefinitionPending } =
    useDeleteWorkflowDefinition();

  const handleDeleteActionTrigger = deleteAction.triggerAction;
  const handleDeleteActionCancel = deleteAction.resetAction;
  const handleDeleteActionConfirm = deleteAction.withConfirmableAction(
    async (id: WorkflowDefinitionDomain["id"]) => {
      await mutateAsync({ params: { id } });
    },
  );

  return (
    <PlatformPageTemplate heading="Workflow" isPending={isPending}>
      <div className="space-y-2.5">
        <div className="flex w-full justify-end">
          <Button
            nativeButton={false}
            render={(props) => (
              <Link href="/platform/workflow/new" {...props} />
            )}
          >
            <PlusIcon />
            Create Workflow
          </Button>
        </div>
        <DataTable
          columns={makeWorkflowDefinitionsTableColumnDef({
            isDeleteConfirmationAlertOpen:
              deleteAction.step === "confirmation" ||
              deleteAction.step === "inProgress",
            isDeleting:
              deleteAction.step === "inProgress" ||
              isDeleteWorkflowDefinitionPending,
            onDeleteActionCancel: handleDeleteActionCancel,
            onDeleteActionConfirm: handleDeleteActionConfirm,
            onDeleteActionTrigger: handleDeleteActionTrigger,
          })}
          data={data ?? []}
          searchKey="name"
          searchPlaceholder="Filter workflows..."
        />
      </div>
    </PlatformPageTemplate>
  );
}
