import { UTCDate } from "@date-fns/utc";
import { and, eq } from "drizzle-orm";
import { isNil } from "es-toolkit";
import { ResultAsync, err } from "neverthrow";
import type z from "zod";
import type { currentUserSchema } from "@/guard/auth-check.guard";
import type { Ctx } from "@/lib/ctx";
import { Err } from "@/lib/err";
import { type aiAgentModels, aiAgentTable } from "@/schema/ai-agent.schema";

type Payload = {
  id: string;
  body: {
    model?: (typeof aiAgentModels)[number];
    name?: string;
  };
  user: z.infer<typeof currentUserSchema>;
};

export const updateAiAgentUseCase = async (
  ctx: Ctx,
  { id, body, user }: Payload,
) => {
  const existsResult = await ResultAsync.fromPromise(
    ctx.db.query.aiAgent.findFirst({
      where: { id, organizationId: user.organizationId },
    }),
    (e) => Err.from(e),
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
          eq(aiAgentTable.organizationId, user.organizationId),
        ),
      ),
    (e) => Err.from(e),
  );
};
