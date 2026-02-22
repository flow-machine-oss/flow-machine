"use client";

import { useQueryClient } from "@tanstack/react-query";
import { isNil } from "es-toolkit";
import { useState } from "react";
import { toast } from "sonner";
import { PlatformPageNotFoundError } from "@/frontend/component/platform/platform-page-not-found-error";
import { PlatformPageTemplate } from "@/frontend/component/platform/platform-page-template";
import { EditCredentialForm } from "@/frontend/feature/editable-credential-details/edit-credential-form";
import type { EditCredentialFormValues } from "@/frontend/feature/editable-credential-details/edit-credential-form-schema";
import { EditableCredentialDetails } from "@/frontend/feature/editable-credential-details/editable-credential-details";
import { useEditCredentialForm } from "@/frontend/feature/editable-credential-details/use-edit-credential-form";
import { useGetCredential } from "@/frontend/hook/credential/use-get-credential";
import { useUpdateCredential } from "@/frontend/hook/credential/use-update-credential";
import { makeGetCredentialQueryKey } from "@/frontend/lib/query/query-key";

type EditableCredentialDetailsPageProps = {
  id: string;
};

export function EditableCredentialDetailsPage({
  id,
}: EditableCredentialDetailsPageProps) {
  const [isEditing, setIsEditing] = useState(false);

  const queryClient = useQueryClient();
  const { data, isPending, isError } = useGetCredential(id);
  const { mutateAsync } = useUpdateCredential();

  const form = useEditCredentialForm();

  const handleEdit = () => {
    if (data) {
      if (data.type === "apiKey") {
        form.reset({
          type: "apiKey",
          apiKey: data.apiKey,
          expiredAt: data.expiredAt,
        });
      } else {
        form.reset({
          type: "basic",
          username: data.username,
          password: data.password,
          expiredAt: data.expiredAt,
        });
      }
    }
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleValidFormSubmit = async (formData: EditCredentialFormValues) => {
    try {
      await mutateAsync({ params: { id }, body: formData });
      await queryClient.invalidateQueries({
        queryKey: makeGetCredentialQueryKey(id),
      });
      toast.success("Credential updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update credential");
    }
  };

  if (isNil(data) || isError) {
    return (
      <PlatformPageTemplate heading="Credential">
        <PlatformPageNotFoundError />
      </PlatformPageTemplate>
    );
  }

  return (
    <PlatformPageTemplate
      heading="Credential"
      isPending={isPending}
    >
      <div className="max-w-2xl space-y-6">
        {isEditing ? (
          <EditCredentialForm
            credential={data}
            form={form}
            onCancel={handleCancel}
            onValidFormSubmit={handleValidFormSubmit}
            onInvalidFormSubmit={() => {}}
          />
        ) : (
          <EditableCredentialDetails
            credential={data}
            onEdit={handleEdit}
          />
        )}
      </div>
    </PlatformPageTemplate>
  );
}
