import { UTCDate } from "@date-fns/utc";
import { and, eq } from "drizzle-orm";
import { isNil } from "es-toolkit";
import { ResultAsync, err } from "neverthrow";
import type z from "zod";
import type { updateGitRepositoryIntegrationRequestBodySchema } from "@/old/dto/git-repository/update-git-repository-integration.dto";
import type { Ctx } from "@/old/lib/ctx";
import { Err } from "@/old/lib/err";
import type { WithOrganizationId } from "@/old/lib/type";
import { gitRepositoryIntegrationTable } from "@/old/schema/git-repository-integration.schema";

type Payload = WithOrganizationId<{
  gitRepositoryId: string;
  gitRepositoryIntegrationId: string;
  body: z.infer<typeof updateGitRepositoryIntegrationRequestBodySchema>;
}>;

export const updateGitRepositoryIntegrationUseCase = async (
  ctx: Ctx,
  {
    gitRepositoryId,
    gitRepositoryIntegrationId,
    body,
    organizationId,
  }: Payload,
) => {
  const existsResult = await ResultAsync.fromPromise(
    ctx.db.query.gitRepositoryIntegration.findFirst({
      where: {
        id: gitRepositoryIntegrationId,
        gitRepositoryId,
        organizationId,
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
          eq(gitRepositoryIntegrationTable.organizationId, organizationId),
        ),
      ),
    (e) => Err.from(e, { cause: e }),
  );
};
