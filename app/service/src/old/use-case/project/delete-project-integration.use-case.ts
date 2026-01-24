import { and, eq } from "drizzle-orm";
import { isNil } from "es-toolkit";
import { ResultAsync, err } from "neverthrow";
import type { Ctx } from "@/old/lib/ctx";
import { Err } from "@/old/lib/err";
import type { WithOrganizationId } from "@/old/lib/type";
import { projectIntegrationTable } from "@/old/schema/project-integration.schema";

type Payload = WithOrganizationId<{
  projectId: string;
  projectIntegrationId: string;
}>;

export const deleteProjectIntegrationUseCase = async (
  ctx: Ctx,
  { projectId, projectIntegrationId, organizationId }: Payload,
) => {
  const existsResult = await ResultAsync.fromPromise(
    ctx.db.query.projectIntegration.findFirst({
      where: {
        id: projectIntegrationId,
        projectId,
        organizationId: organizationId,
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
          eq(projectIntegrationTable.organizationId, organizationId),
        ),
      ),
    (e) => Err.from(e, { cause: e }),
  );
};
