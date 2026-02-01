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
import { useDeleteAiAgent } from "@/hook/ai-agent/use-delete-ai-agent";
import { useListAiAgents } from "@/hook/ai-agent/use-list-ai-agents";
import type { AiAgentResponseDto } from "@/schema/ai-agent/ai-agent-service-schema";

const modelDisplayNames: Record<AiAgentResponseDto["model"], string> = {
  "anthropic/claude-haiku-4.5": "Claude Haiku 4.5",
  "anthropic/claude-opus-4.5": "Claude Opus 4.5",
  "anthropic/claude-sonnet-4.5": "Claude Sonnet 4.5",
  "minimax/minimax-m2.1": "MiniMax M2.1",
  "x-ai/grok-code-fast-1": "Grok Code Fast 1",
  "z-ai/glm-4.7": "GLM 4.7",
};

function ActionsCell({ aiAgent }: { aiAgent: AiAgentResponseDto }) {
  const deleteAiAgent = useDeleteAiAgent();
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    deleteAiAgent.mutate(
      { params: { id: aiAgent.id } },
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
            render={<Link href={`/platform/ai-agent/${aiAgent.id}`} />}
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
          <AlertDialogTitle>Delete AI agent</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &ldquo;{aiAgent.name}&rdquo;? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteAiAgent.isPending}
          >
            {deleteAiAgent.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const columns: ColumnDef<AiAgentResponseDto>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <Link
        href={`/platform/ai-agent/${row.original.id}`}
        className="font-medium hover:underline"
      >
        {row.getValue("name")}
      </Link>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "model",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Model" />
    ),
    cell: ({ row }) => {
      const model = row.getValue("model") as AiAgentResponseDto["model"];
      return <Badge variant="secondary">{modelDisplayNames[model]}</Badge>;
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
    cell: ({ row }) => <ActionsCell aiAgent={row.original} />,
    enableSorting: false,
    enableHiding: false,
  },
];

export default function AiAgentPage() {
  const { data = [], isPending } = useListAiAgents();

  return (
    <PlatformPageTemplate heading="AI Agent">
      {isPending ? (
        <Center>
          <Pending />
        </Center>
      ) : (
        <div className="space-y-2.5">
          <div className="flex w-full justify-end">
            <Button
              render={(props) => (
                <Link href="/platform/ai-agent/new" {...props} />
              )}
            >
              <PlusIcon />
              Create AI Agent
            </Button>
          </div>
          <DataTable
            columns={columns}
            data={data}
            searchKey="name"
            searchPlaceholder="Filter AI agents..."
          />
        </div>
      )}
    </PlatformPageTemplate>
  );
}
