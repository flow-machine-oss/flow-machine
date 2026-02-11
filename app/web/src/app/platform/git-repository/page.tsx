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
import { Center } from "@/component/extended-ui/center";
import {
  DataTable,
  DataTableColumnHeader,
} from "@/component/extended-ui/data-table";
import { Pending } from "@/component/extended-ui/pending";
import { PlatformPageTemplate } from "@/component/platform/platform-page-template";
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
} from "@/component/ui/alert-dialog";
import { Badge } from "@/component/ui/badge";
import { Button } from "@/component/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/component/ui/dropdown-menu";
import type { GitRepositoryDomain } from "@/domain/entity/git-repository/git-repository-domain-schema";
import { useDeleteGitRepository } from "@/frontend/hook/git-repository/use-delete-git-repository";
import { useListGitRepositories } from "@/frontend/hook/git-repository/use-list-git-repositories";

function ActionsCell({ repository }: { repository: GitRepositoryDomain }) {
  const deleteRepository = useDeleteGitRepository();
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    deleteRepository.mutate(
      { payload: { id: repository.id } },
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
            render={<Link href={`/platform/git-repository/${repository.id}`} />}
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
          <AlertDialogTitle>Delete repository</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &ldquo;{repository.name}&rdquo;?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteRepository.isPending}
          >
            {deleteRepository.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const columns: ColumnDef<GitRepositoryDomain>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <Link
        href={`/platform/git-repository/${row.original.id}`}
        className="font-medium hover:underline"
      >
        {row.getValue("name")}
      </Link>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "url",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="URL" />
    ),
    cell: ({ row }) => {
      const url = row.getValue("url") as string;
      return (
        <span className="block max-w-[250px] truncate" title={url}>
          {url}
        </span>
      );
    },
    enableSorting: false,
  },
  {
    id: "provider",
    accessorFn: (row) => row.integration.provider,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Provider" />
    ),
    cell: ({ row }) => {
      const provider = row.original.integration.provider;
      return (
        <Badge variant="secondary">
          {provider === "github" ? "GitHub" : "GitLab"}
        </Badge>
      );
    },
    enableSorting: false,
  },
  {
    id: "defaultBranch",
    accessorFn: (row) => row.config.defaultBranch,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Branch" />
    ),
    cell: ({ row }) => {
      const branch = row.original.config.defaultBranch;
      return <span>{branch}</span>;
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
    cell: ({ row }) => <ActionsCell repository={row.original} />,
    enableSorting: false,
    enableHiding: false,
  },
];

export default function GitRepositoryPage() {
  const { data = [], isPending } = useListGitRepositories();

  return (
    <PlatformPageTemplate heading="Git Repository">
      {isPending ? (
        <Center>
          <Pending />
        </Center>
      ) : (
        <div className="space-y-2.5">
          <div className="flex w-full justify-end">
            <Button
              render={(props) => (
                <Link href="/platform/git-repository/new" {...props} />
              )}
            >
              <PlusIcon />
              Add Repository
            </Button>
          </div>
          <DataTable
            columns={columns}
            data={data}
            searchKey="name"
            searchPlaceholder="Filter repositories..."
          />
        </div>
      )}
    </PlatformPageTemplate>
  );
}
