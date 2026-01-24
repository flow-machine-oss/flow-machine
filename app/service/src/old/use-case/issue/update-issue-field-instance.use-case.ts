import { UTCDate } from "@date-fns/utc";
import { and, eq } from "drizzle-orm";
import { isNil } from "es-toolkit";
import { ResultAsync, err } from "neverthrow";
import type z from "zod";
import type { updateIssueFieldInstanceRequestBodySchema } from "@/old/dto/issue/update-issue-field-instance.dto";
import type { Ctx } from "@/old/lib/ctx";
import { Err } from "@/old/lib/err";
import type { WithOrganizationId } from "@/old/lib/type";
import { issueFieldInstanceTable } from "@/old/schema/issue-field-instance.schema";

type Payload = WithOrganizationId<{
  issueId: string;
  fieldInstanceId: string;
  body: z.infer<typeof updateIssueFieldInstanceRequestBodySchema>;
}>;

export const updateIssueFieldInstanceUseCase = async (
  ctx: Ctx,
  { issueId, fieldInstanceId, body, organizationId }: Payload,
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
      .update(issueFieldInstanceTable)
      .set({
        ...body,
        updatedAt: new UTCDate(),
      })
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
