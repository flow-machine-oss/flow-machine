"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PlatformPageTemplate } from "@/frontend/component/platform/platform-page-template";
import { NewCredentialForm } from "@/frontend/feature/new-credential/new-credential-form";
import type { NewCredentialFormValues } from "@/frontend/feature/new-credential/new-credential-form-schema";
import { useNewCredentialForm } from "@/frontend/feature/new-credential/use-new-credential-form";
import { useCreateCredential } from "@/frontend/hook/credential/use-create-credential";

export function NewCredentialPage() {
  const router = useRouter();

  const { isPending, mutateAsync } = useCreateCredential();
  const form = useNewCredentialForm({ disabled: isPending });

  const handleValidFormSubmit = async (data: NewCredentialFormValues) => {
    try {
      await mutateAsync({ body: data });
      form.reset();
      toast.success("Credential created successfully");
      router.push("/platform/credential");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create credential");
    }
  };

  return (
    <PlatformPageTemplate heading="New Credential">
      <NewCredentialForm
        form={form}
        handleValidFormSubmit={handleValidFormSubmit}
        handleInvalidFormSubmit={() => {
          toast.error("Please fix the errors in the form");
        }}
      />
    </PlatformPageTemplate>
  );
}
