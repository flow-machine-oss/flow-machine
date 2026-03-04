"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  WorkflowJsonEditor,
  type WorkflowJsonEditorData,
} from "@/app/platform/workflow/_component/workflow-json-editor";
import { WorkflowProjectSelector } from "@/app/platform/workflow/_component/workflow-project-selector";
import { PlatformPageTemplate } from "@/frontend/component/platform/platform-page-template";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/frontend/component/ui/tabs";
import { useCreateWorkflowDefinition } from "@/frontend/hook/workflow-definition/use-create-workflow-definition";
import { useListProjects } from "@/frontend/hook/project/use-list-projects";

const INITIAL_WORKFLOW_JSON_VALUE = JSON.stringify(
  {
    name: "My Workflow",
    description: "This is my workflow description.",
    actions: [
      {
        id: "00000000-0000-0000-0000-000000000001",
        kind: "start",
        name: "Start Action",
      },
      {
        id: "00000000-0000-0000-0000-000000000002",
        kind: "end",
        name: "End Action",
      },
    ],
    edges: [
      {
        from: "00000000-0000-0000-0000-000000000001",
        to: "00000000-0000-0000-0000-000000000002",
      },
    ],
  },
  null,
  4,
);

export default function Page() {
  const router = useRouter();
  const { data: projects = [] } = useListProjects();
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const createWorkflow = useCreateWorkflowDefinition({
    onSuccess: () => {
      toast.success("Workflow created successfully");
      router.push("/platform/workflow");
    },
    onError: () => {
      toast.error("Failed to create workflow");
    },
  });

  const handleSave = (data: WorkflowJsonEditorData) => {
    createWorkflow.mutate({
      body: {
        name: data.name,
        description: data.description,
        projects: selectedProjectIds.map((id) => ({
          id,
          syncStatus: "idle" as const,
          syncedAt: null,
        })),
        actions: data.actions,
        edges: data.edges,
        isActive: true,
      },
    });
  };

  return (
    <PlatformPageTemplate heading="New Workflow">
      <div className="grid h-full grid-rows-[auto_1fr] gap-4">
        <WorkflowProjectSelector
          projects={projects}
          selectedProjectIds={selectedProjectIds}
          onSelectedProjectIdsChange={setSelectedProjectIds}
          disabled={createWorkflow.isPending}
        />
        <Tabs
          defaultValue="json"
          className="grid h-full grid-rows-[auto_1fr]"
        >
          <TabsList className="w-fit">
            <TabsTrigger disabled value="ui">
              UI Editor
            </TabsTrigger>
            <TabsTrigger value="json">JSON Editor</TabsTrigger>
          </TabsList>
          <TabsContent className="overflow-hidden" value="json">
            <WorkflowJsonEditor
              initialValue={INITIAL_WORKFLOW_JSON_VALUE}
              onSave={handleSave}
              isPending={createWorkflow.isPending}
              saveButtonLabel="Create"
            />
          </TabsContent>
        </Tabs>
      </div>
    </PlatformPageTemplate>
  );
}
