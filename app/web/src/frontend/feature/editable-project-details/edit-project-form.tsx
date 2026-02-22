import {
  Controller,
  type FieldErrors,
  type UseFormReturn,
} from "react-hook-form";
import type { ProjectDomain } from "@/domain/entity/project/project-domain-schema";
import { makeProjectDomainService } from "@/domain/entity/project/project-domain-service";
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
import { Spinner } from "@/frontend/component/ui/spinner";
import type { EditProjectFormValues } from "@/frontend/feature/editable-project-details/edit-project-form-schema";

type EditProjectFormProps = {
  project: ProjectDomain;
  form: UseFormReturn<EditProjectFormValues>;
  onCancel: () => void;
  onValidFormSubmit: (values: EditProjectFormValues) => Promise<void>;
  onInvalidFormSubmit: (values: FieldErrors<EditProjectFormValues>) => void;
};

export function EditProjectForm({
  project,
  form,
  onCancel,
  onValidFormSubmit,
  onInvalidFormSubmit,
}: EditProjectFormProps) {
  const projectDomainService = makeProjectDomainService({ project });

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
                  A memorable name for your project
                </FieldDescription>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                  disabled={form.formState.isSubmitting}
                  id="name"
                  placeholder="My Project"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Field>
            <FieldLabel>Created at</FieldLabel>
            <FieldContent>
              <span className="text-sm">
                {projectDomainService.getCreatedAt()}
              </span>
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Updated at</FieldLabel>
            <FieldContent>
              <span className="text-sm">
                {projectDomainService.getUpdatedAt()}
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
