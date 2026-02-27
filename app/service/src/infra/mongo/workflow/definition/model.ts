import type { WorkflowDefinitionEntityProps } from "@/core/domain/workflow/definition/entity";
import type { TenantAwareMongoModel } from "@/infra/mongo/model";

type WorkflowDefinitionMongoModel =
  TenantAwareMongoModel<WorkflowDefinitionEntityProps>;

export type { WorkflowDefinitionMongoModel };
