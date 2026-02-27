import type { CredentialEntityProps } from "@/core/domain/credential/entity";
import type { TenantAwareMongoModel } from "@/infra/mongo/model";

type CredentialMongoModel = TenantAwareMongoModel<CredentialEntityProps>;

export type { CredentialMongoModel };
