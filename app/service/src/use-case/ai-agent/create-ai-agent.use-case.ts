import { UTCDate } from "@date-fns/utc";
import { ResultAsync } from "neverthrow";
import type z from "zod";
import type { currentUserSchema } from "@/guard/auth-check.guard";
import type { Ctx } from "@/lib/ctx";
import { Err } from "@/lib/err";
import { newId } from "@/lib/id";
import {
  type AiAgentSelect,
  type aiAgentModels,
  aiAgentTable,
} from "@/schema/ai-agent.schema";

type Payload = {
  body: {
    model: (typeof aiAgentModels)[number];
    name: string;
  };
  user: z.infer<typeof currentUserSchema>;
};

export const createAiAgentUseCase = async (
  ctx: Ctx,
  { body, user }: Payload,
) => {
  const newAiAgent = {
    id: newId(),
    createdAt: new UTCDate(),
    updatedAt: new UTCDate(),
    organizationId: user.organizationId,

    model: body.model,
    name: body.name,
  } as const satisfies AiAgentSelect;

  return ResultAsync.fromPromise(
    ctx.db.insert(aiAgentTable).values(newAiAgent),
    (e) => Err.from(e),
  );
};
