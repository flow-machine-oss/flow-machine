import type { TenantAwareMongoModel } from "@/common/mongo/mongo-model";
import type { DocumentEntityProps } from "@/domain/entity/document/document-entity";

export type DocumentMongoModel = TenantAwareMongoModel<DocumentEntityProps>;
