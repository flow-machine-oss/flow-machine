import { and, eq } from "drizzle-orm";
import { isNil } from "es-toolkit";
import { ResultAsync, err } from "neverthrow";
import type z from "zod";
import type { currentUserSchema } from "@/guard/auth-check.guard";
import type { Ctx } from "@/lib/ctx";
import { Err } from "@/lib/err";
import { projectIntegrationTable } from "@/schema/project-integration.schema";

type Payload = {
  projectId: string;
  projectIntegrationId: string;
  user: z.infer<typeof currentUserSchema>;
};

export const deleteProjectIntegrationUseCase = async (
  ctx: Ctx,
  { projectId, projectIntegrationId, user }: Payload,
) => {
  const existsResult = await ResultAsync.fromPromise(
    ctx.db.query.projectIntegration.findFirst({
      where: {
        id: projectIntegrationId,
        projectId,
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

  return ResultAsync.fromPromise(
    ctx.db
      .delete(projectIntegrationTable)
      .where(
        and(
          eq(projectIntegrationTable.id, projectIntegrationId),
          eq(projectIntegrationTable.projectId, projectId),
          eq(projectIntegrationTable.organizationId, user.organizationId),
        ),
      ),
    (e) => Err.from(e, { cause: e }),
  );
};
