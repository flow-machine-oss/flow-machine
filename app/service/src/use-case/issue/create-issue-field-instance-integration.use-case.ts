import { UTCDate } from "@date-fns/utc";
import { isNil, isNotNil } from "es-toolkit";
import { ResultAsync, err } from "neverthrow";
import type z from "zod";
import type { createIssueFieldInstanceIntegrationRequestBodySchema } from "@/dto/issue/create-issue-field-instance-integration.dto";
import type { currentUserSchema } from "@/guard/auth-check.guard";
import type { Ctx } from "@/lib/ctx";
import { Err } from "@/lib/err";
import { newId } from "@/lib/id";
import { issueFieldInstanceIntegrationTable } from "@/schema/issue-field-instance-integration.schema";

type Payload = {
  issueId: string;
  fieldInstanceId: string;
  body: z.infer<typeof createIssueFieldInstanceIntegrationRequestBodySchema>;
  user: z.infer<typeof currentUserSchema>;
};

export const createIssueFieldInstanceIntegrationUseCase = async (
  ctx: Ctx,
  { issueId, fieldInstanceId, body, user }: Payload,
) => {
  const fieldInstanceCheck = await ResultAsync.fromPromise(
    ctx.db.query.issueFieldInstance.findFirst({
      where: {
        id: fieldInstanceId,
        issueId,
        organizationId: user.organizationId,
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
    organizationId: user.organizationId,

    issueFieldInstanceId: fieldInstanceId,
    externalId: body.externalId,
    providerId: body.providerId,
  } as const;

  return ResultAsync.fromPromise(
    ctx.db.insert(issueFieldInstanceIntegrationTable).values(newIntegration),
    (e) => Err.from(e, { cause: e }),
  );
};
