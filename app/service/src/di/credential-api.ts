import { CredentialV1HttpRouterFactory } from "@/api/module/credential/v1/http-router-factory";
import { CredentialBasicCrudService } from "@/app/domain/credential/basic-crud-service";
import { httpAuthGuardFactory, httpRequestCtxFactory } from "@/di/shared";
import { CredentialMongoCrudRepository } from "@/infra/mongo/credential/crud-repository";

const credentialMongoCrudRepository = new CredentialMongoCrudRepository();
const credentialBasicCrudService = new CredentialBasicCrudService(
  credentialMongoCrudRepository,
);

const credentialV1HttpRouterFactory = new CredentialV1HttpRouterFactory(
  httpAuthGuardFactory,
  httpRequestCtxFactory,
  credentialBasicCrudService,
);

export { credentialV1HttpRouterFactory };
