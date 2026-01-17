import { UTCDate } from "@date-fns/utc";
import { isNil } from "es-toolkit";
import { ResultAsync, err } from "neverthrow";
import type z from "zod";
import type { createIssueIntegrationRequestBodySchema } from "@/dto/issue/create-issue-integration.dto";
import type { currentUserSchema } from "@/guard/auth-check.guard";
import type { Ctx } from "@/lib/ctx";
import { Err } from "@/lib/err";
import { newId } from "@/lib/id";
import { issueIntegrationTable } from "@/schema/issue-integration.schema";

type Payload = {
  issueId: string;
  body: z.infer<typeof createIssueIntegrationRequestBodySchema>;
  user: z.infer<typeof currentUserSchema>;
};

export const createIssueIntegrationUseCase = async (
  ctx: Ctx,
  { issueId, body, user }: Payload,
) => {
  const issueCheck = await ResultAsync.fromPromise(
    ctx.db.query.issue.findFirst({
      where: { id: issueId, organizationId: user.organizationId },
      with: { integration: true },
    }),
    (e) => Err.from(e, { cause: e }),
  );

  if (issueCheck.isErr()) {
    return issueCheck;
  }

  if (isNil(issueCheck.value)) {
    return err(Err.code("notFound", { message: "Issue not found" }));
  }

  if (!isNil(issueCheck.value.integration)) {
    return err(
      Err.code("conflict", {
        message: "Issue already has an integration",
      }),
    );
  }

  const newIntegration = {
    id: newId(),
    createdAt: new UTCDate(),
    updatedAt: new UTCDate(),
    organizationId: user.organizationId,

    externalId: body.externalId,
    externalKey: body.externalKey,
    issueId,
    providerId: body.providerId,
  } as const;

  return ResultAsync.fromPromise(
    ctx.db.insert(issueIntegrationTable).values(newIntegration),
    (e) => Err.from(e, { cause: e }),
  );
};
