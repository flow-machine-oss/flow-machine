"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PlatformPageTemplate } from "@/frontend/component/platform/platform-page-template";
import { NewAiAgentForm } from "@/frontend/feature/new-ai-agent/new-ai-agent-form";
import type { NewAiAgentFormValues } from "@/frontend/feature/new-ai-agent/new-ai-agent-form-schema";
import { useNewAiAgentForm } from "@/frontend/feature/new-ai-agent/use-new-ai-agent-form";
import { useCreateAiAgent } from "@/frontend/hook/ai-agent/use-create-ai-agent";

export function NewAiAgentPage() {
  const router = useRouter();

  const { isPending, mutateAsync } = useCreateAiAgent();
  const form = useNewAiAgentForm({ disabled: isPending });

  const handleValidFormSubmit = async (data: NewAiAgentFormValues) => {
    try {
      await mutateAsync({ body: data });
      form.reset();
      toast.success("AI Agent created successfully");
      router.push("/platform/ai-agent");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create AI Agent");
    }
  };

  return (
    <PlatformPageTemplate heading="New AI Agent">
      <NewAiAgentForm
        form={form}
        handleValidFormSubmit={handleValidFormSubmit}
        handleInvalidFormSubmit={() => {
          toast.error("Please fix the errors in the form");
        }}
      />
    </PlatformPageTemplate>
  );
}
