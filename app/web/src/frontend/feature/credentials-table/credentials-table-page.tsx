"use client";

import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { CredentialDomain } from "@/domain/entity/credential/credential-domain-schema";
import { DataTable } from "@/frontend/component/extended-ui/data-table";
import { PlatformPageTemplate } from "@/frontend/component/platform/platform-page-template";
import { Button } from "@/frontend/component/ui/button";
import { makeCredentialsTableColumnDef } from "@/frontend/feature/credentials-table/credentials-table-column-def";
import { useDeleteCredential } from "@/frontend/hook/credential/use-delete-credential";
import { useListCredentials } from "@/frontend/hook/credential/use-list-credentials";
import { useConfirmableAction } from "@/frontend/hook/use-confirmable-action";
import { useCopyToClipboard } from "@/frontend/hook/use-copy-to-clipboard";

export default function CredentialsTablePage() {
  const deleteAction = useConfirmableAction();
  const [_, copyToClipboard] = useCopyToClipboard();

  const { data, isPending } = useListCredentials();
  const { mutateAsync, isPending: isDeleteCredentialPending } =
    useDeleteCredential();

  const handleCopyAction = async (text: string) => {
    await copyToClipboard(text);
    toast.success("Copied to clipboard");
  };

  const handleDeleteCredentialActionTrigger = deleteAction.triggerAction;
  const handleDeleteCredentialActionCancel = deleteAction.resetAction;
  const handleDeleteCredentialActionConfirm =
    deleteAction.withConfirmableAction(async (id: CredentialDomain["id"]) => {
      await mutateAsync({ params: { id } });
    });

  return (
    <PlatformPageTemplate heading="Credential" isPending={isPending}>
      <div className="space-y-2.5">
        <div className="flex w-full justify-end">
          <Button
            nativeButton={false}
            render={(props) => (
              <Link href="/platform/credential/new" {...props} />
            )}
          >
            <PlusIcon />
            New Credential
          </Button>
        </div>
        <DataTable
          columns={makeCredentialsTableColumnDef({
            isDeleteConfirmationAlertOpen:
              deleteAction.step === "confirmation" ||
              deleteAction.step === "inProgress",
            isDeleting:
              deleteAction.step === "inProgress" || isDeleteCredentialPending,
            onCopyAction: handleCopyAction,
            onDeleteActionCancel: handleDeleteCredentialActionCancel,
            onDeleteActionConfirm: handleDeleteCredentialActionConfirm,
            onDeleteActionTrigger: handleDeleteCredentialActionTrigger,
          })}
          data={data ?? []}
          searchKey="type"
          searchPlaceholder="Filter credentials..."
        />
      </div>
    </PlatformPageTemplate>
  );
}
