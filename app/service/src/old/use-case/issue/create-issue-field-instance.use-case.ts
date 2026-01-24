import { UTCDate } from "@date-fns/utc";
import { isNil } from "es-toolkit";
import { ResultAsync, err } from "neverthrow";
import type z from "zod";
import type { createIssueFieldInstanceRequestBodySchema } from "@/old/dto/issue/create-issue-field-instance.dto";
import type { Ctx } from "@/old/lib/ctx";
import { Err } from "@/old/lib/err";
import { newId } from "@/old/lib/id";
import type { WithOrganizationId } from "@/old/lib/type";
import { issueFieldInstanceTable } from "@/old/schema/issue-field-instance.schema";

type Payload = WithOrganizationId<{
  issueId: string;
  body: z.infer<typeof createIssueFieldInstanceRequestBodySchema>;
}>;

export const createIssueFieldInstanceUseCase = async (
  ctx: Ctx,
  { issueId, body, organizationId }: Payload,
) => {
  const issueCheck = await ResultAsync.fromPromise(
    ctx.db.query.issue.findFirst({
      where: { id: issueId, organizationId },
      with: { fieldInstances: true },
    }),
    (e) => Err.from(e, { cause: e }),
  );

  if (issueCheck.isErr()) {
    return issueCheck;
  }

  if (isNil(issueCheck.value)) {
    return err(Err.code("notFound", { message: "Issue not found" }));
  }

  const existingFieldInstance = issueCheck.value.fieldInstances.find(
    (instance) =>
      instance.issueFieldDefinitionId === body.issueFieldDefinitionId,
  );

  if (existingFieldInstance) {
    return err(
      Err.code("conflict", {
        message: "Issue already has a field instance for this field definition",
      }),
    );
  }

  const fieldDefinitionCheck = await ResultAsync.fromPromise(
    ctx.db.query.issueFieldDefinition.findFirst({
      where: {
        id: body.issueFieldDefinitionId,
        organizationId,
      },
    }),
    (e) => Err.from(e, { cause: e }),
  );

  if (fieldDefinitionCheck.isErr()) {
    return fieldDefinitionCheck;
  }

  if (isNil(fieldDefinitionCheck.value)) {
    return err(
      Err.code("notFound", { message: "Issue field definition not found" }),
    );
  }

  const newFieldInstance = {
    id: newId(),
    createdAt: new UTCDate(),
    updatedAt: new UTCDate(),
    organizationId,
    issueId,
    issueFieldDefinitionId: body.issueFieldDefinitionId,
    value: body.value ?? null,
  } as const;

  return ResultAsync.fromPromise(
    ctx.db.insert(issueFieldInstanceTable).values(newFieldInstance),
    (e) => Err.from(e, { cause: e }),
  );
};
