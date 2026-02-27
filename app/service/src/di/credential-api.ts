import { CredentialV1HttpRouterFactory } from "@/api/module/credential/v1/http-router-factory";
import { CredentialBasicCrudService } from "@/app/domain/credential/basic-crud-service";
import {
  envConfigService,
  httpAuthGuardFactory,
  httpRequestCtxFactory,
  mongoClient,
} from "@/di/shared";
import { CredentialMongoCrudRepository } from "@/infra/mongo/credential/crud-repository";

const credentialMongoCrudRepository = new CredentialMongoCrudRepository(
  envConfigService,
  mongoClient,
);
const credentialBasicCrudService = new CredentialBasicCrudService(
  credentialMongoCrudRepository,
);

const credentialV1HttpRouterFactory = new CredentialV1HttpRouterFactory(
  httpAuthGuardFactory,
  httpRequestCtxFactory,
  credentialBasicCrudService,
);

export { credentialV1HttpRouterFactory };
