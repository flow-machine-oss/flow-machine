import type { TenantAwareMongoModel } from "@/common/mongo/mongo-model";
import type { ProjectEntityProps } from "@/v2/core/domain/project/entity";

type ProjectMongoModel = TenantAwareMongoModel<ProjectEntityProps>;

export type { ProjectMongoModel };
