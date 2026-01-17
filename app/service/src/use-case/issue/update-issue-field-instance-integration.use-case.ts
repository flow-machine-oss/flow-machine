import { UTCDate } from "@date-fns/utc";
import { and, eq } from "drizzle-orm";
import { isNil } from "es-toolkit";
import { ResultAsync, err } from "neverthrow";
import type z from "zod";
import type { updateIssueFieldInstanceIntegrationRequestBodySchema } from "@/dto/issue/update-issue-field-instance-integration.dto";
import type { currentUserSchema } from "@/guard/auth-check.guard";
import type { Ctx } from "@/lib/ctx";
import { Err } from "@/lib/err";
import { issueFieldInstanceIntegrationTable } from "@/schema/issue-field-instance-integration.schema";

type Payload = {
  issueId: string;
  fieldInstanceId: string;
  integrationId: string;
  body: z.infer<typeof updateIssueFieldInstanceIntegrationRequestBodySchema>;
  user: z.infer<typeof currentUserSchema>;
};

export const updateIssueFieldInstanceIntegrationUseCase = async (
  ctx: Ctx,
  { issueId, fieldInstanceId, integrationId, body, user }: Payload,
) => {
  const fieldInstanceCheck = await ResultAsync.fromPromise(
    ctx.db.query.issueFieldInstance.findFirst({
      where: {
        id: fieldInstanceId,
        issueId,
        organizationId: user.organizationId,
      },
    }),
    (e) => Err.from(e, { cause: e }),
  );

  if (fieldInstanceCheck.isErr()) {
    return fieldInstanceCheck;
  }

  if (isNil(fieldInstanceCheck.value)) {
    return err(
      Err.code("notFound", { message: "Issue field instance not found" }),
    );
  }

  const existsResult = await ResultAsync.fromPromise(
    ctx.db.query.issueFieldInstanceIntegration.findFirst({
      where: {
        id: integrationId,
        issueFieldInstanceId: fieldInstanceId,
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
      .update(issueFieldInstanceIntegrationTable)
      .set({
        ...body,
        updatedAt: new UTCDate(),
      })
      .where(
        and(
          eq(issueFieldInstanceIntegrationTable.id, integrationId),
          eq(
            issueFieldInstanceIntegrationTable.issueFieldInstanceId,
            fieldInstanceId,
          ),
          eq(
            issueFieldInstanceIntegrationTable.organizationId,
            user.organizationId,
          ),
        ),
      ),
    (e) => Err.from(e, { cause: e }),
  );
};
