import { aiAgentEntityToResponseDto } from "@/adapter/http/ai-agent/ai-agent-http-v1-mapper";
import { makeAiAgentHttpV1Router } from "@/adapter/http/ai-agent/ai-agent-http-v1-router";
import { getAiAgentMongoCollection } from "@/adapter/repository/mongo/ai-agent/ai-agent-mongo-collection";
import { makeDeleteAiAgentMongoRepository } from "@/adapter/repository/mongo/ai-agent/delete-ai-agent-mongo-repository";
import { makeFindAiAgentByIdMongoRepository } from "@/adapter/repository/mongo/ai-agent/find-ai-agent-by-id-mongo-repository";
import { makeFindAiAgentsMongoRepository } from "@/adapter/repository/mongo/ai-agent/find-ai-agents-mongo-repository";
import { makeInsertAiAgentMongoRepository } from "@/adapter/repository/mongo/ai-agent/insert-ai-agent-mongo-repository";
import { makeUpdateAiAgentMongoRepository } from "@/adapter/repository/mongo/ai-agent/update-ai-agent-mongo-repository";
import { makeCreateAiAgentUseCase } from "@/app/use-case/ai-agent/create-ai-agent-use-case";
import { makeDeleteAiAgentUseCase } from "@/app/use-case/ai-agent/delete-ai-agent-use-case";
import { makeGetAiAgentUseCase } from "@/app/use-case/ai-agent/get-ai-agent-use-case";
import { makeListAiAgentsUseCase } from "@/app/use-case/ai-agent/list-ai-agents-use-case";
import { makeUpdateAiAgentUseCase } from "@/app/use-case/ai-agent/update-ai-agent-use-case";
import { getActiveMember, getSession } from "@/di/auth-di";

// Repositories
const insertAiAgentMongoRepository = makeInsertAiAgentMongoRepository({
  getAiAgentMongoCollection,
});
const findAiAgentByIdMongoRepository = makeFindAiAgentByIdMongoRepository({
  getAiAgentMongoCollection,
});
const findAiAgentsMongoRepository = makeFindAiAgentsMongoRepository({
  getAiAgentMongoCollection,
});
const updateAiAgentMongoRepository = makeUpdateAiAgentMongoRepository({
  getAiAgentMongoCollection,
});
const deleteAiAgentMongoRepository = makeDeleteAiAgentMongoRepository({
  getAiAgentMongoCollection,
});

// Use cases
export const createAiAgentUseCase = makeCreateAiAgentUseCase({
  insertAiAgentRepository: insertAiAgentMongoRepository,
});
export const getAiAgentUseCase = makeGetAiAgentUseCase({
  findAiAgentByIdRepository: findAiAgentByIdMongoRepository,
});
export const listAiAgentsUseCase = makeListAiAgentsUseCase({
  findAiAgentsRepository: findAiAgentsMongoRepository,
});
export const updateAiAgentUseCase = makeUpdateAiAgentUseCase({
  updateAiAgentRepository: updateAiAgentMongoRepository,
});
export const deleteAiAgentUseCase = makeDeleteAiAgentUseCase({
  deleteAiAgentRepository: deleteAiAgentMongoRepository,
});

export const aiAgentHttpV1Router = makeAiAgentHttpV1Router({
  aiAgentEntityToResponseDto,
  getSession,
  getActiveMember,
  createAiAgentUseCase,
  deleteAiAgentUseCase,
  getAiAgentUseCase,
  listAiAgentsUseCase,
  updateAiAgentUseCase,
});
