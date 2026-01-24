import { UTCDate } from "@date-fns/utc";
import { ResultAsync } from "neverthrow";
import z from "zod";
import { createAiAgentRequestBodySchema } from "@/old/dto/ai-agent/create-ai-agent.dto";
import type { Ctx } from "@/old/lib/ctx";
import { Err } from "@/old/lib/err";
import { newId } from "@/old/lib/id";
import type { WithOrganizationId } from "@/old/lib/type";
import { type AiAgentSelect, aiAgentTable } from "@/old/schema/ai-agent.schema";

type Payload = WithOrganizationId<{
  body: z.infer<typeof createAiAgentRequestBodySchema>;
}>;

export const createAiAgentUseCase = async (
  ctx: Ctx,
  { body, organizationId }: Payload,
) => {
  const newAiAgent = {
    id: newId(),
    createdAt: new UTCDate(),
    updatedAt: new UTCDate(),
    organizationId,

    model: body.model,
    name: body.name,
  } as const satisfies AiAgentSelect;

  return ResultAsync.fromPromise(
    ctx.db.insert(aiAgentTable).values(newAiAgent),
    (e) => Err.from(e, { cause: e }),
  );
};
