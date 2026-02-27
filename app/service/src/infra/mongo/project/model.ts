import type { ProjectEntityProps } from "@/core/domain/project/entity";
import type { TenantAwareMongoModel } from "@/infra/mongo/model";

type ProjectMongoModel = TenantAwareMongoModel<ProjectEntityProps>;

export type { ProjectMongoModel };
