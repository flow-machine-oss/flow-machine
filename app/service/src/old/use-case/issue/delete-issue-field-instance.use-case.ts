import { and, eq } from "drizzle-orm";
import { isNil } from "es-toolkit";
import { ResultAsync, err } from "neverthrow";
import type { Ctx } from "@/old/lib/ctx";
import { Err } from "@/old/lib/err";
import type { WithOrganizationId } from "@/old/lib/type";
import { issueFieldInstanceTable } from "@/old/schema/issue-field-instance.schema";

type Payload = WithOrganizationId<{
  issueId: string;
  fieldInstanceId: string;
}>;

export const deleteIssueFieldInstanceUseCase = async (
  ctx: Ctx,
  { issueId, fieldInstanceId, organizationId }: Payload,
) => {
  const existsResult = await ResultAsync.fromPromise(
    ctx.db.query.issueFieldInstance.findFirst({
      where: {
        id: fieldInstanceId,
        issueId,
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
      .delete(issueFieldInstanceTable)
      .where(
        and(
          eq(issueFieldInstanceTable.id, fieldInstanceId),
          eq(issueFieldInstanceTable.issueId, issueId),
          eq(issueFieldInstanceTable.organizationId, organizationId),
        ),
      ),
    (e) => Err.from(e, { cause: e }),
  );
};
