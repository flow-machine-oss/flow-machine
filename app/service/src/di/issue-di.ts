import { issueEntityToResponseDto } from "@/adapter/http/issue/issue-http-v1-dto-mapper";
import { makeIssueHttpV1Router } from "@/adapter/http/issue/issue-http-v1-router";
import { makeDeleteIssueMongoRepository } from "@/adapter/repository/mongo/issue/delete-issue-mongo-repository";
import { makeFindIssueByIdMongoRepository } from "@/adapter/repository/mongo/issue/find-issue-by-id-mongo-repository";
import { makeFindIssuesMongoRepository } from "@/adapter/repository/mongo/issue/find-issues-mongo-repository";
import { getIssueMongoCollection } from "@/adapter/repository/mongo/issue/issue-mongo-collection";
import {
  issueEntityToMongoModel,
  issueMongoModelToEntity,
} from "@/adapter/repository/mongo/issue/issue-mongo-mapper";
import { makeInsertIssueMongoRepository } from "@/adapter/repository/mongo/issue/insert-issue-mongo-repository";
import { makeUpdateIssueMongoRepository } from "@/adapter/repository/mongo/issue/update-issue-mongo-repository";
import { makeCreateIssueUseCase } from "@/app/use-case/issue/create-issue-use-case";
import { makeDeleteIssueUseCase } from "@/app/use-case/issue/delete-issue-use-case";
import { makeGetIssueUseCase } from "@/app/use-case/issue/get-issue-use-case";
import { makeListIssuesUseCase } from "@/app/use-case/issue/list-issues-use-case";
import { makeUpdateIssueUseCase } from "@/app/use-case/issue/update-issue-use-case";
import { getActiveMember, getSession } from "@/di/auth-di";

// Repositories
const insertIssueMongoRepository = makeInsertIssueMongoRepository({
  getIssueMongoCollection,
  issueEntityToMongoModel,
});
export const findIssueByIdMongoRepository = makeFindIssueByIdMongoRepository({
  getIssueMongoCollection,
  issueMongoModelToEntity,
});
const findIssuesMongoRepository = makeFindIssuesMongoRepository({
  getIssueMongoCollection,
  issueMongoModelToEntity,
});
const updateIssueMongoRepository = makeUpdateIssueMongoRepository({
  getIssueMongoCollection,
});
const deleteIssueMongoRepository = makeDeleteIssueMongoRepository({
  getIssueMongoCollection,
});

// Use cases
export const createIssueUseCase = makeCreateIssueUseCase({
  insertIssueRepository: insertIssueMongoRepository,
});
export const getIssueUseCase = makeGetIssueUseCase({
  findIssueByIdRepository: findIssueByIdMongoRepository,
});
export const listIssuesUseCase = makeListIssuesUseCase({
  findIssuesRepository: findIssuesMongoRepository,
});
export const updateIssueUseCase = makeUpdateIssueUseCase({
  updateIssueRepository: updateIssueMongoRepository,
});
export const deleteIssueUseCase = makeDeleteIssueUseCase({
  deleteIssueRepository: deleteIssueMongoRepository,
});

export const issueHttpV1Router = makeIssueHttpV1Router({
  getSession,
  getActiveMember,
  createIssueUseCase,
  deleteIssueUseCase,
  getIssueUseCase,
  issueEntityToResponseDto,
  listIssuesUseCase,
  updateIssueUseCase,
});
