import { and, eq } from "drizzle-orm";
import { isNil } from "es-toolkit";
import { ResultAsync, err } from "neverthrow";
import type z from "zod";
import type { currentUserSchema } from "@/guard/auth-check.guard";
import type { Ctx } from "@/lib/ctx";
import { Err } from "@/lib/err";
import { issueIntegrationTable } from "@/schema/issue-integration.schema";

type Payload = {
  issueId: string;
  issueIntegrationId: string;
  user: z.infer<typeof currentUserSchema>;
};

export const deleteIssueIntegrationUseCase = async (
  ctx: Ctx,
  { issueId, issueIntegrationId, user }: Payload,
) => {
  const existsResult = await ResultAsync.fromPromise(
    ctx.db.query.issueIntegration.findFirst({
      where: {
        id: issueIntegrationId,
        issueId,
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
      .delete(issueIntegrationTable)
      .where(
        and(
          eq(issueIntegrationTable.id, issueIntegrationId),
          eq(issueIntegrationTable.issueId, issueId),
          eq(issueIntegrationTable.organizationId, user.organizationId),
        ),
      ),
    (e) => Err.from(e, { cause: e }),
  );
};
