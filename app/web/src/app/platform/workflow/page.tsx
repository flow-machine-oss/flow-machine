"use client";

import "@xyflow/react/dist/style.css";
import { useState } from "react";
import { JsonEditor } from "@/component/extended-ui/json-editor";
import { PlatformPageTemplate } from "@/component/platform/platform-page-template";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/component/ui/tabs";

export default function Page() {
  const [value, setValue] = useState<string>("");

  return (
    <PlatformPageTemplate heading="New Workflow">
      <div>
        <Tabs defaultValue="json" className="w-[400px]">
          <TabsList>
            <TabsTrigger disabled value="ui">
              UI Editor
            </TabsTrigger>
            <TabsTrigger value="json">JSON Editor</TabsTrigger>
          </TabsList>
          <TabsContent value="json">
            <JsonEditor value={value} onValueChange={setValue} />
          </TabsContent>
        </Tabs>
      </div>
    </PlatformPageTemplate>
  );
}
