import type { UseFormReturn } from "react-hook-form";
import { Button } from "@/frontend/component/ui/button";
import { Field } from "@/frontend/component/ui/field";
import { Spinner } from "@/frontend/component/ui/spinner";
import type { CreateAiAgentFormValues } from "@/frontend/feature/create-ai-agent/create-ai-agent-form";

type CreateAiAgentFormActionsProps = {
  form: UseFormReturn<CreateAiAgentFormValues>;
  formId: string;
};

export function CreateAiAgentFormActions({
  form,
  formId,
}: CreateAiAgentFormActionsProps) {
  return (
    <Field orientation="horizontal">
      <Button
        disabled={form.formState.isSubmitting}
        type="button"
        variant="outline"
        onClick={() => form.reset()}
      >
        Reset
      </Button>
      <Button
        disabled={form.formState.isSubmitting}
        form={formId}
        type="submit"
      >
        {form.formState.isSubmitting ? (
          <>
            <Spinner />
            Saving...
          </>
        ) : (
          "Save"
        )}
      </Button>
    </Field>
  );
}
