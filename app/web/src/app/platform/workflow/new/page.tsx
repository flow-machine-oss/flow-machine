"use client";

import { BrushCleaningIcon } from "lucide-react";
import { workflowJsonEditorSchema } from "@/app/platform/workflow/_schema/workflow-editor-schema";
import { JsonEditorTextarea } from "@/component/extended-ui/json-editor-textarea";
import { PlatformPageTemplate } from "@/component/platform/platform-page-template";
import { Button } from "@/component/ui/button";
import { ButtonGroup } from "@/component/ui/button-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/component/ui/tabs";
import { useJsonEditor } from "@/hook/use-json-editor";

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
  const jsonEditor = useJsonEditor({
    initialValue: INITIAL_WORKFLOW_JSON_VALUE,
    schema: workflowJsonEditorSchema,
  });

  return (
    <PlatformPageTemplate heading="New Workflow">
      <Tabs defaultValue="json" className="grid h-full grid-rows-[auto_1fr]">
        <TabsList className="w-fit">
          <TabsTrigger disabled value="ui">
            UI Editor
          </TabsTrigger>
          <TabsTrigger value="json">JSON Editor</TabsTrigger>
        </TabsList>
        <TabsContent className="overflow-hidden" value="json">
          <div className="relative grid h-full grid-rows-[1fr_auto] gap-2">
            <ButtonGroup className="absolute top-2 right-2 z-10">
              <Button
                onClick={jsonEditor.onFormat}
                size="icon-xs"
                variant="outline"
              >
                <BrushCleaningIcon />
              </Button>
            </ButtonGroup>
            <JsonEditorTextarea
              value={jsonEditor.value}
              onChange={(e) => jsonEditor.onChange(e.target.value)}
              onKeyDown={jsonEditor.onKeyDown}
            />
            <Button className="justify-self-end" variant="default">
              Save
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </PlatformPageTemplate>
  );
}
