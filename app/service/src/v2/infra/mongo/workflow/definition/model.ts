import type { TenantAwareMongoModel } from "@/common/mongo/mongo-model";
import type { WorkflowDefinitionEntityProps } from "@/v2/core/domain/workflow/definition/entity";

type WorkflowDefinitionMongoModel =
  TenantAwareMongoModel<WorkflowDefinitionEntityProps>;

export type { WorkflowDefinitionMongoModel };
