import z from "zod";
import { baseTenantAwareMongoModelSchema } from "@/common/mongo/mongo-model";
import { issueEntityProps } from "@/domain/entity/issue/issue-entity";

export const issueMongoModelSchema = z.object({
  ...baseTenantAwareMongoModelSchema.shape,
  ...issueEntityProps.shape,
});
export type IssueMongoModel = z.infer<typeof issueMongoModelSchema>;
