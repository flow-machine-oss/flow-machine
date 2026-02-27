import type { TenantAwareMongoModel } from "@/common/mongo/mongo-model";
import type { GitRepositoryEntityProps } from "@/core/domain/git-repository/entity";

type GitRepositoryMongoModel = TenantAwareMongoModel<GitRepositoryEntityProps>;

export type { GitRepositoryMongoModel };
