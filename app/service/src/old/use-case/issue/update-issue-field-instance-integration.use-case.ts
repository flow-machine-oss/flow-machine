import { UTCDate } from "@date-fns/utc";
import { and, eq } from "drizzle-orm";
import { isNil } from "es-toolkit";
import { ResultAsync, err } from "neverthrow";
import type z from "zod";
import type { updateIssueFieldInstanceIntegrationRequestBodySchema } from "@/old/dto/issue/update-issue-field-instance-integration.dto";
import type { Ctx } from "@/old/lib/ctx";
import { Err } from "@/old/lib/err";
import type { WithOrganizationId } from "@/old/lib/type";
import { issueFieldInstanceIntegrationTable } from "@/old/schema/issue-field-instance-integration.schema";

type Payload = WithOrganizationId<{
  issueId: string;
  fieldInstanceId: string;
  integrationId: string;
  body: z.infer<typeof updateIssueFieldInstanceIntegrationRequestBodySchema>;
}>;

export const updateIssueFieldInstanceIntegrationUseCase = async (
  ctx: Ctx,
  { issueId, fieldInstanceId, integrationId, body, organizationId }: Payload,
) => {
  const fieldInstanceCheck = await ResultAsync.fromPromise(
    ctx.db.query.issueFieldInstance.findFirst({
      where: {
        id: fieldInstanceId,
        issueId,
        organizationId,
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
          eq(issueFieldInstanceIntegrationTable.organizationId, organizationId),
        ),
      ),
    (e) => Err.from(e, { cause: e }),
  );
};
