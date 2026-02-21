import { format } from "date-fns";
import {
  Controller,
  type FieldErrors,
  type UseFormReturn,
} from "react-hook-form";
import {
  type AiAgentDomain,
  aiAgentDomainSchema,
} from "@/domain/entity/ai-agent/ai-agent-domain-schema";
import { Button } from "@/frontend/component/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/frontend/component/ui/field";
import { Input } from "@/frontend/component/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/frontend/component/ui/select";
import { Spinner } from "@/frontend/component/ui/spinner";
import type { EditAiAgentFormValues } from "@/frontend/feature/editable-ai-agent-details/edit-ai-agent-form-schema";

type EditAiAgentFormProps = {
  aiAgent: AiAgentDomain;
  form: UseFormReturn<EditAiAgentFormValues>;
  onCancel: () => void;
  onValidFormSubmit: (values: EditAiAgentFormValues) => Promise<void>;
  onInvalidFormSubmit: (values: FieldErrors<EditAiAgentFormValues>) => void;
};

export function EditAiAgentForm({
  aiAgent,
  form,
  onCancel,
  onValidFormSubmit,
  onInvalidFormSubmit,
}: EditAiAgentFormProps) {
  return (
    <form
      className="space-y-6"
      onSubmit={form.handleSubmit(onValidFormSubmit, onInvalidFormSubmit)}
    >
      <FieldSet>
        <FieldLegend>Basic</FieldLegend>
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <FieldDescription>
                  A memorable name for your custom AI agent
                </FieldDescription>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                  disabled={form.formState.isSubmitting}
                  id="name"
                  placeholder="John Doe"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="model"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field orientation="responsive" data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor="model">Model</FieldLabel>
                  <FieldDescription>
                    Select the best model for your use case
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
                <Select
                  disabled={form.formState.isSubmitting}
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="model"
                    aria-invalid={fieldState.invalid}
                    className="min-w-[120px]"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    align="end"
                    side="bottom"
                    alignItemWithTrigger={false}
                  >
                    {aiAgentDomainSchema.shape.model.options.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
          <Field>
            <FieldLabel>Created at</FieldLabel>
            <FieldContent>
              <span className="text-sm">
                {format(aiAgent.createdAt, "MMM d, yyyy, h:mm a")}
              </span>
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Updated at</FieldLabel>
            <FieldContent>
              <span className="text-sm">
                {format(aiAgent.updatedAt, "MMM d, yyyy, h:mm a")}
              </span>
            </FieldContent>
          </Field>
        </FieldGroup>
      </FieldSet>
      <Field orientation="horizontal">
        <Button
          disabled={form.formState.isSubmitting}
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button disabled={form.formState.isSubmitting} type="submit">
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
    </form>
  );
}
