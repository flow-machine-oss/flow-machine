import { UTCDate } from "@date-fns/utc";
import { and, eq } from "drizzle-orm";
import { isNil } from "es-toolkit";
import { ResultAsync, err } from "neverthrow";
import type z from "zod";
import type { updateIssueFieldInstanceRequestBodySchema } from "@/dto/issue/update-issue-field-instance.dto";
import type { currentUserSchema } from "@/guard/auth-check.guard";
import type { Ctx } from "@/lib/ctx";
import { Err } from "@/lib/err";
import { issueFieldInstanceTable } from "@/schema/issue-field-instance.schema";

type Payload = {
  issueId: string;
  fieldInstanceId: string;
  body: z.infer<typeof updateIssueFieldInstanceRequestBodySchema>;
  user: z.infer<typeof currentUserSchema>;
};

export const updateIssueFieldInstanceUseCase = async (
  ctx: Ctx,
  { issueId, fieldInstanceId, body, user }: Payload,
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
      .update(issueFieldInstanceTable)
      .set({
        ...body,
        updatedAt: new UTCDate(),
      })
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
