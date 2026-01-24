import { UTCDate } from "@date-fns/utc";
import { and, eq } from "drizzle-orm";
import { isNil } from "es-toolkit";
import { ResultAsync, err } from "neverthrow";
import type z from "zod";
import { updateAiAgentRequestBodySchema } from "@/old/dto/ai-agent/update-ai-agent.dto";
import type { Ctx } from "@/old/lib/ctx";
import { Err } from "@/old/lib/err";
import type { WithOrganizationId } from "@/old/lib/type";
import { aiAgentTable } from "@/old/schema/ai-agent.schema";

type Payload = WithOrganizationId<{
  id: string;
  body: z.infer<typeof updateAiAgentRequestBodySchema>;
}>;

export const updateAiAgentUseCase = async (
  ctx: Ctx,
  { id, body, organizationId }: Payload,
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
      .update(aiAgentTable)
      .set({
        ...body,
        updatedAt: new UTCDate(),
      })
      .where(
        and(
          eq(aiAgentTable.id, id),
          eq(aiAgentTable.organizationId, organizationId),
        ),
      ),
    (e) => Err.from(e, { cause: e }),
  );
};
