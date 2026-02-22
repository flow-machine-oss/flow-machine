import { useEffect } from "react";
import {
  Controller,
  type SubmitErrorHandler,
  type SubmitHandler,
  type UseFormReturn,
} from "react-hook-form";
import { credentialTypes } from "@/domain/entity/credential/credential-domain-schema";
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
import type { NewCredentialFormValues } from "@/frontend/feature/new-credential/new-credential-form-schema";

const typeDisplayNames: Record<(typeof credentialTypes)[number], string> = {
  apiKey: "API Key",
  basic: "Basic",
};

type NewCredentialFormProps = {
  form: UseFormReturn<NewCredentialFormValues>;
  handleValidFormSubmit: SubmitHandler<NewCredentialFormValues>;
  handleInvalidFormSubmit: SubmitErrorHandler<NewCredentialFormValues>;
};

export function NewCredentialForm({
  form,
  handleValidFormSubmit,
  handleInvalidFormSubmit,
}: NewCredentialFormProps) {
  const watchedType = form.watch("type");

  useEffect(() => {
    if (watchedType === "apiKey") {
      form.setValue("apiKey" as keyof NewCredentialFormValues, "");
    } else {
      form.setValue("username" as keyof NewCredentialFormValues, "");
      form.setValue("password" as keyof NewCredentialFormValues, "");
    }
  }, [watchedType, form]);

  return (
    <form
      className="max-w-2xl space-y-6"
      onSubmit={form.handleSubmit(
        handleValidFormSubmit,
        handleInvalidFormSubmit,
      )}
    >
      <FieldSet>
        <FieldLegend>Credential details</FieldLegend>
        <FieldDescription>
          Fill in the details below to create a new credential
        </FieldDescription>
        <FieldGroup>
          <Controller
            name="type"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                orientation="responsive"
                data-invalid={fieldState.invalid}
              >
                <FieldContent>
                  <FieldLabel htmlFor="type">Type</FieldLabel>
                  <FieldDescription>
                    Select the credential type
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
                    id="type"
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
                    {credentialTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {typeDisplayNames[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
          {watchedType === "apiKey" && (
            <Controller
              name="apiKey"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="apiKey">API Key</FieldLabel>
                  <FieldDescription>
                    The API key for authentication
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
          {watchedType === "basic" && (
            <>
              <Controller
                name="username"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="username">Username</FieldLabel>
                    <FieldDescription>
                      The username for basic authentication
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
                      The password for basic authentication
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
                  The expiration date of this credential
                </FieldDescription>
                <Input
                  {...field}
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
