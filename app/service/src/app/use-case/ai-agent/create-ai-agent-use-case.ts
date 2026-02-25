import { err, ok } from "neverthrow";
import { AiAgentEntity } from "@/domain/entity/ai-agent/ai-agent-entity";
import type { InsertAiAgentRepository } from "@/domain/port/ai-agent/ai-agent-repository";
import {
  type CreateAiAgentUseCase,
  createAiAgentUseCaseSchema,
} from "@/domain/port/ai-agent/ai-agent-use-case";

type Input = {
  insertAiAgentRepository: InsertAiAgentRepository;
};

export const makeCreateAiAgentUseCase = ({
  insertAiAgentRepository,
}: Input): CreateAiAgentUseCase =>
  createAiAgentUseCaseSchema.implementAsync(async ({ ctx, payload }) => {
    const makeNewEntityResult = AiAgentEntity.makeNew(ctx.tenant, {
      name: payload.name,
      model: payload.model,
      projects: payload.projects,
    });

    if (makeNewEntityResult.isErr()) {
      return err(makeNewEntityResult.error);
    }
    const insertResult = await insertAiAgentRepository({
      ctx,
      data: makeNewEntityResult.value,
    });

    if (insertResult.isErr()) {
      return err(insertResult.error);
    }
    return ok();
  });
