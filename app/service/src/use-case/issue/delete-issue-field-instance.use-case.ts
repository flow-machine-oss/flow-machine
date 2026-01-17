import { and, eq } from "drizzle-orm";
import { isNil } from "es-toolkit";
import { ResultAsync, err } from "neverthrow";
import type z from "zod";
import type { currentUserSchema } from "@/guard/auth-check.guard";
import type { Ctx } from "@/lib/ctx";
import { Err } from "@/lib/err";
import { issueFieldInstanceTable } from "@/schema/issue-field-instance.schema";

type Payload = {
  issueId: string;
  fieldInstanceId: string;
  user: z.infer<typeof currentUserSchema>;
};

export const deleteIssueFieldInstanceUseCase = async (
  ctx: Ctx,
  { issueId, fieldInstanceId, user }: Payload,
) => {
  const existsResult = await ResultAsync.fromPromise(
    ctx.db.query.issueFieldInstance.findFirst({
      where: {
        id: fieldInstanceId,
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
      .delete(issueFieldInstanceTable)
      .where(
        and(
          eq(issueFieldInstanceTable.id, fieldInstanceId),
          eq(issueFieldInstanceTable.issueId, issueId),
          eq(issueFieldInstanceTable.organizationId, user.organizationId),
        ),
      ),
    (e) => Err.from(e, { cause: e }),
  );
};
