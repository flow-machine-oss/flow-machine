import type { DocumentEntityProps } from "@/core/domain/document/entity";
import type { TenantAwareMongoModel } from "@/infra/mongo/model";

type DocumentMongoModel = TenantAwareMongoModel<DocumentEntityProps>;

export type { DocumentMongoModel };
