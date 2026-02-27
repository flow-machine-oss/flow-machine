import type { GitRepositoryEntityProps } from "@/core/domain/git-repository/entity";
import type { TenantAwareMongoModel } from "@/infra/mongo/model";

type GitRepositoryMongoModel = TenantAwareMongoModel<GitRepositoryEntityProps>;

export type { GitRepositoryMongoModel };
