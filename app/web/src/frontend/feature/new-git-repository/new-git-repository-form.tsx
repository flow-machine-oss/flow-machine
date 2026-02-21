import {
  Controller,
  type SubmitErrorHandler,
  type SubmitHandler,
  type UseFormReturn,
} from "react-hook-form";
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
import type { NewGitRepositoryFormValues } from "@/frontend/feature/new-git-repository/new-git-repository-form-schema";

type NewGitRepositoryFormProps = {
  form: UseFormReturn<NewGitRepositoryFormValues>;
  handleValidFormSubmit: SubmitHandler<NewGitRepositoryFormValues>;
  handleInvalidFormSubmit: SubmitErrorHandler<NewGitRepositoryFormValues>;
};

export function NewGitRepositoryForm({
  form,
  handleValidFormSubmit,
  handleInvalidFormSubmit,
}: NewGitRepositoryFormProps) {
  return (
    <form
      className="max-w-2xl space-y-6"
      onSubmit={form.handleSubmit(
        handleValidFormSubmit,
        handleInvalidFormSubmit,
      )}
    >
      <FieldSet>
        <FieldLegend>Basic details</FieldLegend>
        <FieldDescription>
          Fill in the details below to add a new git repository
        </FieldDescription>
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <FieldDescription>
                  A memorable name for your git repository
                </FieldDescription>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                  disabled={form.formState.isSubmitting}
                  id="name"
                  placeholder="my-repository"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="url"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="url">URL</FieldLabel>
                <FieldDescription>
                  The clone URL of the git repository
                </FieldDescription>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                  disabled={form.formState.isSubmitting}
                  id="url"
                  placeholder="https://github.com/owner/repo.git"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Configuration</FieldLegend>
        <FieldDescription>
          Configure the default branch and git identity
        </FieldDescription>
        <FieldGroup>
          <Controller
            name="config.defaultBranch"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="config.defaultBranch">
                  Default Branch
                </FieldLabel>
                <FieldDescription>
                  The default branch of the repository
                </FieldDescription>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                  disabled={form.formState.isSubmitting}
                  id="config.defaultBranch"
                  placeholder="main"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="config.email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="config.email">Email</FieldLabel>
                <FieldDescription>
                  The email address used for git commits
                </FieldDescription>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                  disabled={form.formState.isSubmitting}
                  id="config.email"
                  placeholder="user@example.com"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="config.username"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="config.username">Username</FieldLabel>
                <FieldDescription>
                  The username used for git commits
                </FieldDescription>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                  disabled={form.formState.isSubmitting}
                  id="config.username"
                  placeholder="johndoe"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Integration</FieldLegend>
        <FieldDescription>
          Configure the git provider integration
        </FieldDescription>
        <FieldGroup>
          <Controller
            name="integration.provider"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field orientation="responsive" data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor="integration.provider">
                    Provider
                  </FieldLabel>
                  <FieldDescription>
                    Select the git hosting provider
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
                    id="integration.provider"
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
                    <SelectItem value="github">GitHub</SelectItem>
                    <SelectItem value="gitlab">GitLab</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
          <Controller
            name="integration.credentialId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="integration.credentialId">
                  Credential ID
                </FieldLabel>
                <FieldDescription>
                  The credential used to authenticate with the provider
                </FieldDescription>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                  disabled={form.formState.isSubmitting}
                  id="integration.credentialId"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </FieldSet>

      <Field orientation="horizontal">
        <Button
          disabled={form.formState.isSubmitting}
          type="button"
          variant="outline"
          onClick={() => form.reset()}
        >
          Reset
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
