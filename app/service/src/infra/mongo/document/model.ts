import type { TenantAwareMongoModel } from "@/common/mongo/mongo-model";
import type { DocumentEntityProps } from "@/core/domain/document/entity";

type DocumentMongoModel = TenantAwareMongoModel<DocumentEntityProps>;

export type { DocumentMongoModel };
