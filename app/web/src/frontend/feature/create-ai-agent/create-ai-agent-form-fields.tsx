import { Controller, type UseFormReturn } from "react-hook-form";
import { aiAgentDomainSchema } from "@/domain/entity/ai-agent/ai-agent-domain-schema";
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
import type { CreateAiAgentFormValues } from "@/frontend/feature/create-ai-agent/create-ai-agent-form";

type CreateAiAgentFormFieldsProps = {
  form: UseFormReturn<CreateAiAgentFormValues>;
};

export function CreateAiAgentFormFields({
  form,
}: CreateAiAgentFormFieldsProps) {
  return (
    <FieldSet>
      <FieldLegend>Basic details</FieldLegend>
      <FieldDescription>
        Fill in the details below to create your custom AI agent
      </FieldDescription>
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
      </FieldGroup>
    </FieldSet>
  );
}
