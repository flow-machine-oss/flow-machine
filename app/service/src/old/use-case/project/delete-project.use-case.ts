import { and, eq } from "drizzle-orm";
import { isNil } from "es-toolkit";
import { ResultAsync, err } from "neverthrow";
import type { Ctx } from "@/old/lib/ctx";
import { Err } from "@/old/lib/err";
import type { WithOrganizationId } from "@/old/lib/type";
import { projectTable } from "@/old/schema/project.schema";

type Payload = WithOrganizationId<{
  id: string;
}>;

export const deleteProjectUseCase = async (
  ctx: Ctx,
  { id, organizationId }: Payload,
) => {
  const existsResult = await ResultAsync.fromPromise(
    ctx.db.query.project.findFirst({
      where: { id, organizationId: organizationId },
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
      .delete(projectTable)
      .where(
        and(
          eq(projectTable.id, id),
          eq(projectTable.organizationId, organizationId),
        ),
      ),
    (e) => Err.from(e, { cause: e }),
  );
};
