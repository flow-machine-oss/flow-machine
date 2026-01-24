import { and, eq } from "drizzle-orm";
import { isNil } from "es-toolkit";
import { ResultAsync, err } from "neverthrow";
import type { Ctx } from "@/old/lib/ctx";
import { Err } from "@/old/lib/err";
import type { WithOrganizationId } from "@/old/lib/type";
import { aiAgentTable } from "@/old/schema/ai-agent.schema";

type Payload = WithOrganizationId<{
  id: string;
}>;

export const deleteAiAgentUseCase = async (
  ctx: Ctx,
  { id, organizationId }: Payload,
) => {
  const existsResult = await ResultAsync.fromPromise(
    ctx.db.query.aiAgent.findFirst({
      where: { id, organizationId },
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
      .delete(aiAgentTable)
      .where(
        and(
          eq(aiAgentTable.id, id),
          eq(aiAgentTable.organizationId, organizationId),
        ),
      ),
    (e) => Err.from(e, { cause: e }),
  );
};
