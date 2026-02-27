import type { TenantAwareMongoModel } from "@/common/mongo/mongo-model";
import type { CredentialEntityProps } from "@/core/domain/credential/entity";

type CredentialMongoModel = TenantAwareMongoModel<CredentialEntityProps>;

export type { CredentialMongoModel };
