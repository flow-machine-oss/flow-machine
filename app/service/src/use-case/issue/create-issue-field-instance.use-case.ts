import { UTCDate } from "@date-fns/utc";
import { isNil } from "es-toolkit";
import { ResultAsync, err } from "neverthrow";
import type z from "zod";
import type { createIssueFieldInstanceRequestBodySchema } from "@/dto/issue/create-issue-field-instance.dto";
import type { currentUserSchema } from "@/guard/auth-check.guard";
import type { Ctx } from "@/lib/ctx";
import { Err } from "@/lib/err";
import { newId } from "@/lib/id";
import { issueFieldInstanceTable } from "@/schema/issue-field-instance.schema";

type Payload = {
  issueId: string;
  body: z.infer<typeof createIssueFieldInstanceRequestBodySchema>;
  user: z.infer<typeof currentUserSchema>;
};

export const createIssueFieldInstanceUseCase = async (
  ctx: Ctx,
  { issueId, body, user }: Payload,
) => {
  // Verify issue exists and belongs to user's organization
  const issueCheck = await ResultAsync.fromPromise(
    ctx.db.query.issue.findFirst({
      where: { id: issueId, organizationId: user.organizationId },
      with: { issueFieldInstances: true },
    }),
    (e) => Err.from(e, { cause: e }),
  );

  if (issueCheck.isErr()) {
    return issueCheck;
  }

  if (isNil(issueCheck.value)) {
    return err(Err.code("notFound", { message: "Issue not found" }));
  }

  // Check if field instance with same definition already exists (unique constraint)
  const existingFieldInstance = issueCheck.value.issueFieldInstances.find(
    (instance) => instance.issueFieldDefinitionId === body.issueFieldDefinitionId,
  );

  if (existingFieldInstance) {
    return err(
      Err.code("conflict", {
        message:
          "Issue already has a field instance for this field definition",
      }),
    );
  }

  // Verify field definition exists and belongs to user's organization
  const fieldDefinitionCheck = await ResultAsync.fromPromise(
    ctx.db.query.issueFieldDefinition.findFirst({
      where: {
        id: body.issueFieldDefinitionId,
        organizationId: user.organizationId,
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
    organizationId: user.organizationId,
    issueId,
    issueFieldDefinitionId: body.issueFieldDefinitionId,
    value: body.value ?? null,
  } as const;

  return ResultAsync.fromPromise(
    ctx.db.insert(issueFieldInstanceTable).values(newFieldInstance),
    (e) => Err.from(e, { cause: e }),
  );
};
