import { UTCDate } from "@date-fns/utc";
import { and, eq } from "drizzle-orm";
import { isNil } from "es-toolkit";
import { ResultAsync, err } from "neverthrow";
import type z from "zod";
import type { updateGitRepositoryIntegrationRequestBodySchema } from "@/dto/git-repository/update-git-repository-integration.dto";
import type { currentUserSchema } from "@/guard/auth-check.guard";
import type { Ctx } from "@/lib/ctx";
import { Err } from "@/lib/err";
import { gitRepositoryIntegrationTable } from "@/schema/git-repository-integration.schema";

type Payload = {
  gitRepositoryId: string;
  gitRepositoryIntegrationId: string;
  body: z.infer<typeof updateGitRepositoryIntegrationRequestBodySchema>;
  user: z.infer<typeof currentUserSchema>;
};

export const updateGitRepositoryIntegrationUseCase = async (
  ctx: Ctx,
  { gitRepositoryId, gitRepositoryIntegrationId, body, user }: Payload,
) => {
  const existsResult = await ResultAsync.fromPromise(
    ctx.db.query.gitRepositoryIntegration.findFirst({
      where: {
        id: gitRepositoryIntegrationId,
        gitRepositoryId,
        organizationId: user.organizationId,
      },
    }),
    (e) => Err.from(e, { cause: e }),
  );

  if (existsResult.isErr()) {
    return existsResult;
  }

  if (isNil(existsResult.value)) {
    return err(Err.code("notFound"));
  }

  if (body.credentialId) {
    const credentialCheck = await ResultAsync.fromPromise(
      ctx.db.query.integrationBasicCredential.findFirst({
        where: { id: body.credentialId, organizationId: user.organizationId },
      }),
      (e) => Err.from(e, { cause: e }),
    );

    if (credentialCheck.isErr()) {
      return credentialCheck;
    }

    if (isNil(credentialCheck.value)) {
      return err(Err.code("notFound", { message: "Credential not found" }));
    }
  }

  return ResultAsync.fromPromise(
    ctx.db
      .update(gitRepositoryIntegrationTable)
      .set({
        ...body,
        updatedAt: new UTCDate(),
      })
      .where(
        and(
          eq(gitRepositoryIntegrationTable.gitRepositoryId, gitRepositoryId),
          eq(gitRepositoryIntegrationTable.organizationId, user.organizationId),
        ),
      ),
    (e) => Err.from(e, { cause: e }),
  );
};
