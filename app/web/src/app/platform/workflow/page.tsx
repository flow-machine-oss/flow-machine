"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { WorkflowDefinitionDomain } from "@/domain/entity/workflow-definition/workflow-definition-domain-schema";
import { Center } from "@/frontend/component/extended-ui/center";
import {
  DataTable,
  DataTableColumnHeader,
} from "@/frontend/component/extended-ui/data-table";
import { Pending } from "@/frontend/component/extended-ui/pending";
import { PlatformPageTemplate } from "@/frontend/component/platform/platform-page-template";
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
import { useDeleteWorkflowDefinition } from "@/frontend/hook/workflow-definition/use-delete-workflow-definition";
import { useListWorkflowDefinitions } from "@/frontend/hook/workflow-definition/use-list-workflow-definitions";

function ActionsCell({ workflow }: { workflow: WorkflowDefinitionDomain }) {
  const deleteWorkflow = useDeleteWorkflowDefinition();
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    deleteWorkflow.mutate(
      { params: { id: workflow.id } },
      { onSuccess: () => setOpen(false) },
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="sm" className="size-8 p-0" />}
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontalIcon className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            render={<Link href={`/platform/workflow/${workflow.id}`} />}
          >
            <PencilIcon className="size-4" />
            Edit
          </DropdownMenuItem>
          <AlertDialogTrigger
            render={
              <DropdownMenuItem className="text-destructive focus:text-destructive" />
            }
          >
            <TrashIcon className="size-4" />
            Delete
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete workflow</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &ldquo;{workflow.name}&rdquo;? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteWorkflow.isPending}
          >
            {deleteWorkflow.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const columns: ColumnDef<WorkflowDefinitionDomain>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <Link
        href={`/platform/workflow/${row.original.id}`}
        className="font-medium hover:underline"
      >
        {row.getValue("name")}
      </Link>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const description = row.getValue("description") as string | undefined;
      if (!description) return <span className="text-muted-foreground">-</span>;
      return (
        <span className="block max-w-[200px] truncate" title={description}>
          {description}
        </span>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => {
      const actions = row.original.actions;
      return <span>{actions.length}</span>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return <span>{format(date, "MMM d, yyyy")}</span>;
    },
    enableSorting: false,
  },
  {
    id: "rowActions",
    cell: ({ row }) => <ActionsCell workflow={row.original} />,
    enableSorting: false,
    enableHiding: false,
  },
];

export default function WorkflowPage() {
  const { data, isPending } = useListWorkflowDefinitions();

  return (
    <PlatformPageTemplate heading="Workflow">
      {isPending ? (
        <Center>
          <Pending />
        </Center>
      ) : (
        <div className="space-y-2.5">
          <div className="flex w-full justify-end">
            <Button
              render={(props) => (
                <Link href="/platform/workflow/new" {...props} />
              )}
            >
              <PlusIcon />
              Create Workflow
            </Button>
          </div>
          <DataTable
            columns={columns}
            data={data ?? []}
            searchKey="name"
            searchPlaceholder="Filter workflows..."
          />
        </div>
      )}
    </PlatformPageTemplate>
  );
}
