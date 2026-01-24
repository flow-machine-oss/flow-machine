import { UTCDate } from "@date-fns/utc";
import { isNil } from "es-toolkit";
import { ResultAsync, err } from "neverthrow";
import type z from "zod";
import type { createGitRepositoryIntegrationRequestBodySchema } from "@/old/dto/git-repository/create-git-repository-integration.dto";
import type { Ctx } from "@/old/lib/ctx";
import { Err } from "@/old/lib/err";
import { newId } from "@/old/lib/id";
import type { WithOrganizationId } from "@/old/lib/type";
import { gitRepositoryIntegrationTable } from "@/old/schema/git-repository-integration.schema";

type Payload = WithOrganizationId<{
  gitRepositoryId: string;
  body: z.infer<typeof createGitRepositoryIntegrationRequestBodySchema>;
}>;

export const createGitRepositoryIntegrationUseCase = async (
  ctx: Ctx,
  { gitRepositoryId, body, organizationId }: Payload,
) => {
  // Verify git repository exists and belongs to user's organization
  const gitRepoCheck = await ResultAsync.fromPromise(
    ctx.db.query.gitRepository.findFirst({
      where: { id: gitRepositoryId, organizationId },
      with: { integration: true },
    }),
    (e) => Err.from(e, { cause: e }),
  );

  if (gitRepoCheck.isErr()) {
    return gitRepoCheck;
  }

  if (isNil(gitRepoCheck.value)) {
    return err(Err.code("notFound", { message: "Git repository not found" }));
  }

  // Check if integration already exists (one-to-one relationship)
  if (!isNil(gitRepoCheck.value.integration)) {
    return err(
      Err.code("conflict", {
        message: "Git repository already has an integration",
      }),
    );
  }

  // Verify credential exists and belongs to user's organization
  const credentialCheck = await ResultAsync.fromPromise(
    ctx.db.query.integrationBasicCredential.findFirst({
      where: { id: body.credentialId, organizationId },
    }),
    (e) => Err.from(e, { cause: e }),
  );

  if (credentialCheck.isErr()) {
    return credentialCheck;
  }

  if (isNil(credentialCheck.value)) {
    return err(Err.code("notFound", { message: "Credential not found" }));
  }

  const newIntegration = {
    id: newId(),
    createdAt: new UTCDate(),
    updatedAt: new UTCDate(),
    organizationId,

    credentialId: body.credentialId,
    gitRepositoryId,
    providerId: body.providerId,
  } as const;

  return ResultAsync.fromPromise(
    ctx.db.insert(gitRepositoryIntegrationTable).values(newIntegration),
    (e) => Err.from(e, { cause: e }),
  );
};
