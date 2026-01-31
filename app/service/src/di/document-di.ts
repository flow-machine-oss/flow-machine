import { makeDocumentHttpV1Router } from "@/adapter/http/document/document-http-v1-router";
import { makeDeleteDocumentMongoRepository } from "@/adapter/repository/mongo/document/delete-document-mongo-repository";
import { getDocumentMongoCollection } from "@/adapter/repository/mongo/document/document-mongo-collection";
import { makeFindDocumentByIdMongoRepository } from "@/adapter/repository/mongo/document/find-document-by-id-mongo-repository";
import { makeFindDocumentsMongoRepository } from "@/adapter/repository/mongo/document/find-documents-mongo-repository";
import { makeInsertDocumentMongoRepository } from "@/adapter/repository/mongo/document/insert-document-mongo-repository";
import { makeUpdateDocumentMongoRepository } from "@/adapter/repository/mongo/document/update-document-mongo-repository";
import { makeCreateDocumentUseCase } from "@/app/use-case/document/create-document-use-case";
import { makeDeleteDocumentUseCase } from "@/app/use-case/document/delete-document-use-case";
import { makeGetDocumentUseCase } from "@/app/use-case/document/get-document-use-case";
import { makeListDocumentsUseCase } from "@/app/use-case/document/list-documents-use-case";
import { makeUpdateDocumentUseCase } from "@/app/use-case/document/update-document-use-case";
import { getActiveMember, getSession } from "@/di/auth-di";

// Repositories
const insertDocumentMongoRepository = makeInsertDocumentMongoRepository({
  getDocumentMongoCollection,
});
const findDocumentByIdMongoRepository = makeFindDocumentByIdMongoRepository({
  getDocumentMongoCollection,
});
const findDocumentsMongoRepository = makeFindDocumentsMongoRepository({
  getDocumentMongoCollection,
});
const updateDocumentMongoRepository = makeUpdateDocumentMongoRepository({
  getDocumentMongoCollection,
});
const deleteDocumentMongoRepository = makeDeleteDocumentMongoRepository({
  getDocumentMongoCollection,
});

// Use cases
export const createDocumentUseCase = makeCreateDocumentUseCase({
  insertDocumentRepository: insertDocumentMongoRepository,
});
export const getDocumentUseCase = makeGetDocumentUseCase({
  findDocumentByIdRepository: findDocumentByIdMongoRepository,
});
export const listDocumentsUseCase = makeListDocumentsUseCase({
  findDocumentsRepository: findDocumentsMongoRepository,
});
export const updateDocumentUseCase = makeUpdateDocumentUseCase({
  updateDocumentRepository: updateDocumentMongoRepository,
});
export const deleteDocumentUseCase = makeDeleteDocumentUseCase({
  deleteDocumentRepository: deleteDocumentMongoRepository,
});

export const documentHttpV1Router = makeDocumentHttpV1Router({
  getSession,
  getActiveMember,
  createDocumentUseCase,
  deleteDocumentUseCase,
  getDocumentUseCase,
  listDocumentsUseCase,
  updateDocumentUseCase,
});
