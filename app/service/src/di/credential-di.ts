import { makeCredentialHttpV1Router } from "@/adapter/http/credential/credential-http-v1-router";
import { getCredentialMongoCollection } from "@/adapter/repository/mongo/credential/credential-mongo-collection";
import { makeDeleteCredentialMongoRepository } from "@/adapter/repository/mongo/credential/delete-credential-mongo-repository";
import { makeFindCredentialByIdMongoRepository } from "@/adapter/repository/mongo/credential/find-credential-by-id-mongo-repository";
import { makeFindCredentialsMongoRepository } from "@/adapter/repository/mongo/credential/find-credentials-mongo-repository";
import { makeInsertCredentialMongoRepository } from "@/adapter/repository/mongo/credential/insert-credential-mongo-repository";
import { makeUpdateCredentialMongoRepository } from "@/adapter/repository/mongo/credential/update-credential-mongo-repository";
import { makeCreateCredentialUseCase } from "@/app/use-case/credential/create-credential-use-case";
import { makeDeleteCredentialUseCase } from "@/app/use-case/credential/delete-credential-use-case";
import { makeGetCredentialUseCase } from "@/app/use-case/credential/get-credential-use-case";
import { makeListCredentialsUseCase } from "@/app/use-case/credential/list-credentials-use-case";
import { makeUpdateCredentialUseCase } from "@/app/use-case/credential/update-credential-use-case";
import { getActiveMember, getSession } from "@/di/auth-di";

// Repositories
const insertCredentialMongoRepository = makeInsertCredentialMongoRepository({
  getCredentialMongoCollection,
});
const findCredentialByIdMongoRepository = makeFindCredentialByIdMongoRepository(
  {
    getCredentialMongoCollection,
  },
);
const findCredentialsMongoRepository = makeFindCredentialsMongoRepository({
  getCredentialMongoCollection,
});
const updateCredentialMongoRepository = makeUpdateCredentialMongoRepository({
  getCredentialMongoCollection,
});
const deleteCredentialMongoRepository = makeDeleteCredentialMongoRepository({
  getCredentialMongoCollection,
});

// Use cases
export const createCredentialUseCase = makeCreateCredentialUseCase({
  insertCredentialRepository: insertCredentialMongoRepository,
});
export const getCredentialUseCase = makeGetCredentialUseCase({
  findCredentialByIdRepository: findCredentialByIdMongoRepository,
});
export const listCredentialsUseCase = makeListCredentialsUseCase({
  findCredentialsRepository: findCredentialsMongoRepository,
});
export const updateCredentialUseCase = makeUpdateCredentialUseCase({
  updateCredentialRepository: updateCredentialMongoRepository,
});
export const deleteCredentialUseCase = makeDeleteCredentialUseCase({
  deleteCredentialRepository: deleteCredentialMongoRepository,
});

export const credentialHttpV1Router = makeCredentialHttpV1Router({
  getSession,
  getActiveMember,
  createCredentialUseCase,
  deleteCredentialUseCase,
  getCredentialUseCase,
  listCredentialsUseCase,
  updateCredentialUseCase,
});
