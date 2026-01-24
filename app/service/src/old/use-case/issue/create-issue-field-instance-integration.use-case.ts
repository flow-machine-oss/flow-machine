import { UTCDate } from "@date-fns/utc";
import { isNil, isNotNil } from "es-toolkit";
import { ResultAsync, err } from "neverthrow";
import type z from "zod";
import type { createIssueFieldInstanceIntegrationRequestBodySchema } from "@/old/dto/issue/create-issue-field-instance-integration.dto";
import type { Ctx } from "@/old/lib/ctx";
import { Err } from "@/old/lib/err";
import { newId } from "@/old/lib/id";
import type { WithOrganizationId } from "@/old/lib/type";
import { issueFieldInstanceIntegrationTable } from "@/old/schema/issue-field-instance-integration.schema";

type Payload = WithOrganizationId<{
  issueId: string;
  fieldInstanceId: string;
  body: z.infer<typeof createIssueFieldInstanceIntegrationRequestBodySchema>;
}>;

export const createIssueFieldInstanceIntegrationUseCase = async (
  ctx: Ctx,
  { issueId, fieldInstanceId, body, organizationId }: Payload,
) => {
  const fieldInstanceCheck = await ResultAsync.fromPromise(
    ctx.db.query.issueFieldInstance.findFirst({
      where: {
        id: fieldInstanceId,
        issueId,
        organizationId,
      },
      with: { integration: true },
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

  if (isNotNil(fieldInstanceCheck.value.integration)) {
    return err(
      Err.code("conflict", {
        message: "Issue field instance already has an integration",
      }),
    );
  }

  const newIntegration = {
    id: newId(),
    createdAt: new UTCDate(),
    updatedAt: new UTCDate(),
    organizationId,

    issueFieldInstanceId: fieldInstanceId,
    externalId: body.externalId,
    providerId: body.providerId,
  } as const;

  return ResultAsync.fromPromise(
    ctx.db.insert(issueFieldInstanceIntegrationTable).values(newIntegration),
    (e) => Err.from(e, { cause: e }),
  );
};
