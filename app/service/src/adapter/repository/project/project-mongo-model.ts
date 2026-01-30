import type { TenantAwareMongoModel } from "@/common/mongo/mongo-model";
import type { ProjectEntityProps } from "@/domain/entity/project/project-entity";

export type ProjectMongoModel = TenantAwareMongoModel<ProjectEntityProps>;
