import { and, eq } from "drizzle-orm";
import { isNil } from "es-toolkit";
import { ResultAsync, err } from "neverthrow";
import type z from "zod";
import type { currentUserSchema } from "@/guard/auth-check.guard";
import type { Ctx } from "@/lib/ctx";
import { Err } from "@/lib/err";
import { gitRepositoryIntegrationTable } from "@/schema/git-repository-integration.schema";

type Payload = {
  gitRepositoryId: string;
  integrationId: string;
  user: z.infer<typeof currentUserSchema>;
};

export const deleteGitRepositoryIntegrationUseCase = async (
  ctx: Ctx,
  { gitRepositoryId, integrationId, user }: Payload,
) => {
  // Verify integration exists
  const existsResult = await ResultAsync.fromPromise(
    ctx.db.query.gitRepositoryIntegration.findFirst({
      where: {
        id: integrationId,
        gitRepositoryId,
        organizationId: user.organizationId,
      },
    }),
    (e) => Err.from(e),
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
          eq(gitRepositoryIntegrationTable.id, integrationId),
          eq(gitRepositoryIntegrationTable.gitRepositoryId, gitRepositoryId),
          eq(gitRepositoryIntegrationTable.organizationId, user.organizationId),
        ),
      ),
    (e) => Err.from(e),
  );
};
