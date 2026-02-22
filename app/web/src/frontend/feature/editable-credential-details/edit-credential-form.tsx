import {
  Controller,
  type FieldErrors,
  type UseFormReturn,
} from "react-hook-form";
import type { CredentialDomain } from "@/domain/entity/credential/credential-domain-schema";
import { makeCredentialDomainService } from "@/domain/entity/credential/credential-domain-service";
import { Badge } from "@/frontend/component/ui/badge";
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
import type { EditCredentialFormValues } from "@/frontend/feature/editable-credential-details/edit-credential-form-schema";

type EditCredentialFormProps = {
  credential: CredentialDomain;
  form: UseFormReturn<EditCredentialFormValues>;
  onCancel: () => void;
  onValidFormSubmit: (values: EditCredentialFormValues) => Promise<void>;
  onInvalidFormSubmit: (
    values: FieldErrors<EditCredentialFormValues>,
  ) => void;
};

export function EditCredentialForm({
  credential,
  form,
  onCancel,
  onValidFormSubmit,
  onInvalidFormSubmit,
}: EditCredentialFormProps) {
  const credentialDomainService = makeCredentialDomainService({ credential });

  return (
    <form
      className="space-y-6"
      onSubmit={form.handleSubmit(onValidFormSubmit, onInvalidFormSubmit)}
    >
      <FieldSet>
        <FieldLegend>Credential</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel>Type</FieldLabel>
            <FieldContent>
              <Badge variant="secondary" className="w-fit">
                {credentialDomainService.getTypeDisplayName()}
              </Badge>
            </FieldContent>
          </Field>
          {credential.type === "apiKey" && (
            <Controller
              name="apiKey"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="apiKey">API Key</FieldLabel>
                  <FieldDescription>
                    Update the API key (leave empty to keep current)
                  </FieldDescription>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    disabled={form.formState.isSubmitting}
                    id="apiKey"
                    placeholder="sk-..."
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          )}
          {credential.type === "basic" && (
            <>
              <Controller
                name="username"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="username">Username</FieldLabel>
                    <FieldDescription>
                      Update the username
                    </FieldDescription>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      disabled={form.formState.isSubmitting}
                      id="username"
                      placeholder="username"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <FieldDescription>
                      Update the password (leave empty to keep current)
                    </FieldDescription>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      disabled={form.formState.isSubmitting}
                      id="password"
                      type="password"
                      placeholder="••••••••"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </>
          )}
          <Controller
            name="expiredAt"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="expiredAt">Expired At</FieldLabel>
                <FieldDescription>
                  Update the expiration date
                </FieldDescription>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                  disabled={form.formState.isSubmitting}
                  id="expiredAt"
                  type="datetime-local"
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
                {credentialDomainService.getCreatedAt()}
              </span>
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Updated at</FieldLabel>
            <FieldContent>
              <span className="text-sm">
                {credentialDomainService.getUpdatedAt()}
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
