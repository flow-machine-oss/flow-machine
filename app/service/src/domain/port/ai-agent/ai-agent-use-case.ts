import z from "zod";
import { Err } from "@/common/err/err";
import { makeResultSchema } from "@/common/schema/result-schema";
import { AiAgentEntity } from "@/domain/entity/ai-agent/ai-agent-entity";
import {
  createAiAgentUseCaseInputSchema,
  deleteAiAgentUseCaseInputSchema,
  getAiAgentUseCaseInputSchema,
  listAiAgentsUseCaseInputSchema,
  updateAiAgentUseCaseInputSchema,
} from "@/domain/port/ai-agent/ai-agent-dto";

export const createAiAgentUseCaseSchema = z.function({
  input: [createAiAgentUseCaseInputSchema],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type CreateAiAgentUseCase = z.output<typeof createAiAgentUseCaseSchema>;

export const getAiAgentUseCaseSchema = z.function({
  input: [getAiAgentUseCaseInputSchema],
  output: z.promise(
    makeResultSchema(z.instanceof(AiAgentEntity), z.instanceof(Err)),
  ),
});
export type GetAiAgentUseCase = z.output<typeof getAiAgentUseCaseSchema>;

export const listAiAgentsUseCaseSchema = z.function({
  input: [listAiAgentsUseCaseInputSchema],
  output: z.promise(
    makeResultSchema(z.array(z.instanceof(AiAgentEntity)), z.instanceof(Err)),
  ),
});
export type ListAiAgentsUseCase = z.output<typeof listAiAgentsUseCaseSchema>;

export const updateAiAgentUseCaseSchema = z.function({
  input: [updateAiAgentUseCaseInputSchema],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type UpdateAiAgentUseCase = z.output<typeof updateAiAgentUseCaseSchema>;

export const deleteAiAgentUseCaseSchema = z.function({
  input: [deleteAiAgentUseCaseInputSchema],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type DeleteAiAgentUseCase = z.output<typeof deleteAiAgentUseCaseSchema>;
