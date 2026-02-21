"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PlatformPageTemplate } from "@/frontend/component/platform/platform-page-template";
import { NewGitRepositoryForm } from "@/frontend/feature/new-git-repository/new-git-repository-form";
import type { NewGitRepositoryFormValues } from "@/frontend/feature/new-git-repository/new-git-repository-form-schema";
import { useNewGitRepositoryForm } from "@/frontend/feature/new-git-repository/use-new-git-repository-form";
import { useCreateGitRepository } from "@/frontend/hook/git-repository/use-create-git-repository";

export function NewGitRepositoryPage() {
  const router = useRouter();

  const { isPending, mutateAsync } = useCreateGitRepository();
  const form = useNewGitRepositoryForm({ disabled: isPending });

  const handleValidFormSubmit = async (data: NewGitRepositoryFormValues) => {
    try {
      await mutateAsync({ body: data });
      form.reset();
      toast.success("Git Repository created successfully");
      router.push("/platform/git-repository");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create Git Repository");
    }
  };

  return (
    <PlatformPageTemplate heading="New Git Repository">
      <NewGitRepositoryForm
        form={form}
        handleValidFormSubmit={handleValidFormSubmit}
        handleInvalidFormSubmit={() => {
          toast.error("Please fix the errors in the form");
        }}
      />
    </PlatformPageTemplate>
  );
}
