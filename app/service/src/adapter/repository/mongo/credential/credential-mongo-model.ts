import type { TenantAwareMongoModel } from "@/common/mongo/mongo-model";
import type { CredentialEntityProps } from "@/domain/entity/credential/credential-entity";

export type CredentialMongoModel = TenantAwareMongoModel<CredentialEntityProps>;
