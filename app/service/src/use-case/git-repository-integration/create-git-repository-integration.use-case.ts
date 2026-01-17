import { UTCDate } from "@date-fns/utc";
import { isNil } from "es-toolkit";
import { ResultAsync, err } from "neverthrow";
import type z from "zod";
import type { currentUserSchema } from "@/guard/auth-check.guard";
import type { Ctx } from "@/lib/ctx";
import { Err } from "@/lib/err";
import { newId } from "@/lib/id";
import { gitRepositoryIntegrationTable } from "@/schema/git-repository-integration.schema";

type Payload = {
  gitRepositoryId: string;
  body: {
    credentialId: string;
    providerId: "gitHub" | "gitLab";
  };
  user: z.infer<typeof currentUserSchema>;
};

export const createGitRepositoryIntegrationUseCase = async (
  ctx: Ctx,
  { gitRepositoryId, body, user }: Payload,
) => {
  // Verify git repository exists and belongs to user's organization
  const gitRepoCheck = await ResultAsync.fromPromise(
    ctx.db.query.gitRepository.findFirst({
      where: { id: gitRepositoryId, organizationId: user.organizationId },
    }),
    (e) => Err.from(e),
  );

  if (gitRepoCheck.isErr()) {
    return gitRepoCheck;
  }

  if (isNil(gitRepoCheck.value)) {
    return err(Err.code("notFound", { message: "Git repository not found" }));
  }

  // Verify credential exists and belongs to user's organization
  const credentialCheck = await ResultAsync.fromPromise(
    ctx.db.query.integrationBasicCredential.findFirst({
      where: { id: body.credentialId, organizationId: user.organizationId },
    }),
    (e) => Err.from(e),
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
    organizationId: user.organizationId,

    credentialId: body.credentialId,
    gitRepositoryId,
    providerId: body.providerId,
  } as const;

  return ResultAsync.fromPromise(
    ctx.db.insert(gitRepositoryIntegrationTable).values(newIntegration),
    (e) => Err.from(e),
  );
};
