import { err, ok } from "neverthrow";
import type { FindAiAgentsRepository } from "@/domain/port/ai-agent/ai-agent-repository";
import {
  type ListAiAgentsUseCase,
  listAiAgentsUseCaseSchema,
} from "@/domain/port/ai-agent/ai-agent-use-case";

type Input = {
  findAiAgentsRepository: FindAiAgentsRepository;
};

export const makeListAiAgentsUseCase = ({
  findAiAgentsRepository,
}: Input): ListAiAgentsUseCase =>
  listAiAgentsUseCaseSchema.implementAsync(async ({ ctx }) => {
    const findResult = await findAiAgentsRepository({ ctx });

    if (findResult.isErr()) {
      return err(findResult.error);
    }
    return ok(findResult.value);
  });
