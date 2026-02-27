import type { TenantAwareMongoModel } from "@/common/mongo/mongo-model";
import type { WorkflowDefinitionEntityProps } from "@/core/domain/workflow/definition/entity";

type WorkflowDefinitionMongoModel =
  TenantAwareMongoModel<WorkflowDefinitionEntityProps>;

export type { WorkflowDefinitionMongoModel };
