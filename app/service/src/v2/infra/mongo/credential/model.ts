import type { TenantAwareMongoModel } from "@/common/mongo/mongo-model";
import type { CredentialEntityProps } from "@/v2/core/domain/credential/entity";

type CredentialMongoModel = TenantAwareMongoModel<CredentialEntityProps>;

export type { CredentialMongoModel };
