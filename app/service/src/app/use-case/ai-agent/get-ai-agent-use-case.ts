import { err, ok } from "neverthrow";
import { Err } from "@/common/err/err";
import type { FindAiAgentByIdRepository } from "@/domain/port/ai-agent/ai-agent-repository";
import {
  type GetAiAgentUseCase,
  getAiAgentUseCaseSchema,
} from "@/domain/port/ai-agent/ai-agent-use-case";

type Input = {
  findAiAgentByIdRepository: FindAiAgentByIdRepository;
};

export const makeGetAiAgentUseCase = ({
  findAiAgentByIdRepository,
}: Input): GetAiAgentUseCase =>
  getAiAgentUseCaseSchema.implementAsync(async ({ ctx, payload }) => {
    const findResult = await findAiAgentByIdRepository({
      ctx,
      id: payload.id,
    });

    if (findResult.isErr()) {
      return err(findResult.error);
    }
    if (findResult.value === null) {
      return err(Err.code("notFound"));
    }
    return ok(findResult.value);
  });
