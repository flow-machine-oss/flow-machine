import { and, eq } from "drizzle-orm";
import { isNil } from "es-toolkit";
import { ResultAsync, err } from "neverthrow";
import type { Ctx } from "@/old/lib/ctx";
import { Err } from "@/old/lib/err";
import type { WithOrganizationId } from "@/old/lib/type";
import { gitRepositoryIntegrationTable } from "@/old/schema/git-repository-integration.schema";

type Payload = WithOrganizationId<{
  gitRepositoryId: string;
  gitRepositoryIntegrationId: string;
}>;

export const deleteGitRepositoryIntegrationUseCase = async (
  ctx: Ctx,
  { gitRepositoryId, gitRepositoryIntegrationId, organizationId }: Payload,
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

  return ResultAsync.fromPromise(
    ctx.db
      .delete(gitRepositoryIntegrationTable)
      .where(
        and(
          eq(gitRepositoryIntegrationTable.gitRepositoryId, gitRepositoryId),
          eq(gitRepositoryIntegrationTable.organizationId, organizationId),
        ),
      ),
    (e) => Err.from(e, { cause: e }),
  );
};
