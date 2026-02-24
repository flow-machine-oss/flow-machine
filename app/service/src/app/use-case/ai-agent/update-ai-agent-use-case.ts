import { err, ok } from "neverthrow";
import type { UpdateAiAgentRepository } from "@/domain/port/ai-agent/ai-agent-repository";
import {
  type UpdateAiAgentUseCase,
  updateAiAgentUseCaseSchema,
} from "@/domain/port/ai-agent/ai-agent-use-case";

type Input = {
  updateAiAgentRepository: UpdateAiAgentRepository;
};

export const makeUpdateAiAgentUseCase = ({
  updateAiAgentRepository,
}: Input): UpdateAiAgentUseCase =>
  updateAiAgentUseCaseSchema.implementAsync(async ({ ctx, payload }) => {
    const updateResult = await updateAiAgentRepository({
      ctx,
      id: payload.id,
      data: {
        name: payload.name,
        model: payload.model,
        projects: payload.projects,
      },
    });

    if (updateResult.isErr()) {
      return err(updateResult.error);
    }
    return ok();
  });
