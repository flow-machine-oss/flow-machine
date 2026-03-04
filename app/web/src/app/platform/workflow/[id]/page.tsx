"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  WorkflowJsonEditor,
  type WorkflowJsonEditorData,
  workflowToEditorJson,
} from "@/app/platform/workflow/_component/workflow-json-editor";
import { WorkflowProjectSelector } from "@/app/platform/workflow/_component/workflow-project-selector";
import { Center } from "@/frontend/component/extended-ui/center";
import { Pending } from "@/frontend/component/extended-ui/pending";
import { PlatformPageTemplate } from "@/frontend/component/platform/platform-page-template";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/frontend/component/ui/tabs";
import { useGetWorkflowDefinition } from "@/frontend/hook/workflow-definition/use-get-workflow-definition";
import { useUpdateWorkflowDefinition } from "@/frontend/hook/workflow-definition/use-update-workflow-definition";
import { useListProjects } from "@/frontend/hook/project/use-list-projects";

export default function Page() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: projects = [] } = useListProjects();
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const { data: workflowEnvelope, isPending: isLoading } =
    useGetWorkflowDefinition(params.id);
  const workflow = workflowEnvelope?.data;
  const updateWorkflow = useUpdateWorkflowDefinition({
    onSuccess: () => {
      toast.success("Workflow updated successfully");
      router.push("/platform/workflow");
    },
    onError: () => {
      toast.error("Failed to update workflow");
    },
  });

  useEffect(() => {
    if (workflow) {
      setSelectedProjectIds(workflow.projects.map((p) => p.id));
    }
  }, [workflow]);

  const handleSave = (data: WorkflowJsonEditorData) => {
    updateWorkflow.mutate({
      params: { id: params.id },
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
      },
    });
  };

  if (isLoading) {
    return (
      <PlatformPageTemplate heading="Edit Workflow">
        <Center>
          <Pending />
        </Center>
      </PlatformPageTemplate>
    );
  }

  if (!workflow) {
    return (
      <PlatformPageTemplate heading="Edit Workflow">
        <Center>
          <p className="text-muted-foreground">Workflow not found</p>
        </Center>
      </PlatformPageTemplate>
    );
  }

  return (
    <PlatformPageTemplate heading={`Edit: ${workflow.name}`}>
      <div className="grid h-full grid-rows-[auto_1fr] gap-4">
        <WorkflowProjectSelector
          projects={projects}
          selectedProjectIds={selectedProjectIds}
          onSelectedProjectIdsChange={setSelectedProjectIds}
          disabled={updateWorkflow.isPending}
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
              key={params.id}
              initialValue={workflowToEditorJson(workflow)}
              onSave={handleSave}
              isPending={updateWorkflow.isPending}
              saveButtonLabel="Save"
            />
          </TabsContent>
        </Tabs>
      </div>
    </PlatformPageTemplate>
  );
}
