"use client";

import { toast } from "sonner";
import { PlatformPageTemplate } from "@/frontend/component/platform/platform-page-template";
import type { CreateAiAgentFormValues } from "@/frontend/feature/create-ai-agent/create-ai-agent-form";
import { CreateAiAgentFormActions } from "@/frontend/feature/create-ai-agent/create-ai-agent-form-actions";
import { CreateAiAgentFormFields } from "@/frontend/feature/create-ai-agent/create-ai-agent-form-fields";
import { useCreateAiAgentForm } from "@/frontend/feature/create-ai-agent/use-create-ai-agent-form";
import { useCreateAiAgent } from "@/frontend/hook/ai-agent/use-create-ai-agent";

const FORM_ID = "create-ai-agent-form";

export function CreateAiAgentPage() {
  const { isPending, mutateAsync } = useCreateAiAgent();
  const form = useCreateAiAgentForm({ disabled: isPending });

  const handleValidFormSubmit = async (data: CreateAiAgentFormValues) => {
    try {
      await mutateAsync({ body: data });
      form.reset();
      toast.success("AI Agent created successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create AI Agent");
    }
  };

  return (
    <PlatformPageTemplate heading="New AI Agent">
      <form
        id={FORM_ID}
        className="max-w-2xl space-y-6"
        onSubmit={form.handleSubmit(handleValidFormSubmit)}
      >
        <CreateAiAgentFormFields form={form} />
        <CreateAiAgentFormActions form={form} formId={FORM_ID} />
      </form>
    </PlatformPageTemplate>
  );
}
