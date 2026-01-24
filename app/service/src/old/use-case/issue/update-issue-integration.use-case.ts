import { UTCDate } from "@date-fns/utc";
import { and, eq } from "drizzle-orm";
import { isNil } from "es-toolkit";
import { ResultAsync, err } from "neverthrow";
import type z from "zod";
import type { updateIssueIntegrationRequestBodySchema } from "@/old/dto/issue/update-issue-integration.dto";
import type { Ctx } from "@/old/lib/ctx";
import { Err } from "@/old/lib/err";
import type { WithOrganizationId } from "@/old/lib/type";
import { issueIntegrationTable } from "@/old/schema/issue-integration.schema";

type Payload = WithOrganizationId<{
  issueId: string;
  issueIntegrationId: string;
  body: z.infer<typeof updateIssueIntegrationRequestBodySchema>;
}>;

export const updateIssueIntegrationUseCase = async (
  ctx: Ctx,
  { issueId, issueIntegrationId, body, organizationId }: Payload,
) => {
  const existsResult = await ResultAsync.fromPromise(
    ctx.db.query.issueIntegration.findFirst({
      where: {
        id: issueIntegrationId,
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
      .update(issueIntegrationTable)
      .set({
        ...body,
        updatedAt: new UTCDate(),
      })
      .where(
        and(
          eq(issueIntegrationTable.id, issueIntegrationId),
          eq(issueIntegrationTable.issueId, issueId),
          eq(issueIntegrationTable.organizationId, organizationId),
        ),
      ),
    (e) => Err.from(e, { cause: e }),
  );
};
