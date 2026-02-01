import z from "zod";
import { baseTenantAwareMongoModelSchema } from "@/common/mongo/mongo-model";
import { gitRepositoryEntityProps } from "@/domain/entity/git-repository/git-repository-entity";

export const gitRepositoryMongoModelSchema = z.object({
  ...baseTenantAwareMongoModelSchema.shape,
  ...gitRepositoryEntityProps.shape,
});
export type GitRepositoryMongoModel = z.infer<
  typeof gitRepositoryMongoModelSchema
>;
