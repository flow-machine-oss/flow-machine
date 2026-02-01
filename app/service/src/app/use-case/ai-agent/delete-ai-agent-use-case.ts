import { err, ok } from "neverthrow";
import type { DeleteAiAgentRepository } from "@/domain/port/ai-agent/ai-agent-repository";
import {
  type DeleteAiAgentUseCase,
  deleteAiAgentUseCaseSchema,
} from "@/domain/port/ai-agent/ai-agent-use-case";

type Input = {
  deleteAiAgentRepository: DeleteAiAgentRepository;
};

export const makeDeleteAiAgentUseCase = ({
  deleteAiAgentRepository,
}: Input): DeleteAiAgentUseCase =>
  deleteAiAgentUseCaseSchema.implementAsync(async ({ ctx, payload }) => {
    const deleteResult = await deleteAiAgentRepository({
      ctx,
      id: payload.id,
    });

    if (deleteResult.isErr()) {
      return err(deleteResult.error);
    }
    return ok();
  });
