import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontalIcon, PencilIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import type { CredentialDomain } from "@/domain/entity/credential/credential-domain-schema";
import { makeCredentialDomainService } from "@/domain/entity/credential/credential-domain-service";
import { DataTableColumnHeader } from "@/frontend/component/extended-ui/data-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/frontend/component/ui/alert-dialog";
import { Badge } from "@/frontend/component/ui/badge";
import { Button } from "@/frontend/component/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/frontend/component/ui/dropdown-menu";
import { Spinner } from "@/frontend/component/ui/spinner";

type MakeCredentialsTableColumnDefInput = {
  isDeleteConfirmationAlertOpen: boolean;
  isDeleting: boolean;
  onDeleteActionCancel: () => void;
  onDeleteActionConfirm: (id: CredentialDomain["id"]) => void;
  onDeleteActionTrigger: () => void;
};

export const makeCredentialsTableColumnDef = ({
  isDeleteConfirmationAlertOpen,
  isDeleting,
  onDeleteActionCancel,
  onDeleteActionConfirm,
  onDeleteActionTrigger,
}: MakeCredentialsTableColumnDefInput) => {
  return [
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
      cell: ({ row }) => {
        const credentialDomainService = makeCredentialDomainService({
          credential: row.original,
        });
        return (
          <Link
            href={`/platform/credential/${row.original.id}`}
            className="hover:underline"
          >
            <Badge variant="secondary">
              {credentialDomainService.getTypeDisplayName()}
            </Badge>
          </Link>
        );
      },
      enableSorting: false,
    },
    {
      id: "keyInfo",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Key Info" />
      ),
      cell: ({ row }) => {
        const credentialDomainService = makeCredentialDomainService({
          credential: row.original,
        });
        return (
          <span className="font-mono text-sm">
            {credentialDomainService.getMaskedValue()}
          </span>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "expiredAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Expired At" />
      ),
      cell: ({ row }) => {
        const credentialDomainService = makeCredentialDomainService({
          credential: row.original,
        });
        return <span>{credentialDomainService.getExpiredAt()}</span>;
      },
      enableSorting: false,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created" />
      ),
      cell: ({ row }) => {
        const credentialDomainService = makeCredentialDomainService({
          credential: row.original,
        });
        return <span>{credentialDomainService.getCreatedAt()}</span>;
      },
      enableSorting: false,
    },
    {
      id: "rowActions",
      cell: ({ row }) => {
        const credential = row.original;

        return (
          <AlertDialog open={isDeleteConfirmationAlertOpen}>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="ghost" size="icon-sm" />}
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontalIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  nativeButton={false}
                  render={
                    <Link href={`/platform/credential/${credential.id}`} />
                  }
                >
                  <PencilIcon />
                  Edit
                </DropdownMenuItem>
                <AlertDialogTrigger
                  nativeButton={false}
                  onClick={onDeleteActionTrigger}
                  render={
                    <DropdownMenuItem className="text-destructive focus:text-destructive" />
                  }
                >
                  <TrashIcon />
                  Delete
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete credential</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this credential? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  disabled={isDeleting}
                  onClick={onDeleteActionCancel}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  disabled={isDeleting}
                  onClick={() => onDeleteActionConfirm(credential.id)}
                >
                  {isDeleting ? (
                    <>
                      <Spinner />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ] satisfies ColumnDef<CredentialDomain>[];
};
