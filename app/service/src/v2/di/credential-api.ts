import { CredentialV1HttpRouterFactory } from "@/v2/api/module/credential/v1/http-router-factory";
import { CredentialBasicCrudService } from "@/v2/app/domain/credential/basic-crud-service";
import { httpAuthGuardFactory, httpRequestCtxFactory } from "@/v2/di/shared";
import { CredentialMongoCrudRepository } from "@/v2/infra/mongo/credential/crud-repository";

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
