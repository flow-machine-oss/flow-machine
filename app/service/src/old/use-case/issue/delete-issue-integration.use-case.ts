import { and, eq } from "drizzle-orm";
import { isNil } from "es-toolkit";
import { ResultAsync, err } from "neverthrow";
import type { Ctx } from "@/old/lib/ctx";
import { Err } from "@/old/lib/err";
import type { WithOrganizationId } from "@/old/lib/type";
import { issueIntegrationTable } from "@/old/schema/issue-integration.schema";

type Payload = WithOrganizationId<{
  issueId: string;
  issueIntegrationId: string;
}>;

export const deleteIssueIntegrationUseCase = async (
  ctx: Ctx,
  { issueId, issueIntegrationId, organizationId }: Payload,
) => {
  const existsResult = await ResultAsync.fromPromise(
    ctx.db.query.issueIntegration.findFirst({
      where: {
        id: issueIntegrationId,
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
      .delete(issueIntegrationTable)
      .where(
        and(
          eq(issueIntegrationTable.id, issueIntegrationId),
          eq(issueIntegrationTable.issueId, issueId),
          eq(issueIntegrationTable.organizationId, organizationId),
        ),
      ),
    (e) => Err.from(e, { cause: e }),
  );
};
