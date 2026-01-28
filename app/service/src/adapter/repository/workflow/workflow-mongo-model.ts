import type { TenantAwareMongoModel } from "@/common/mongo/mongo-model";
import type { WorkflowEntityProps } from "@/domain/entity/workflow/workflow-entity";

export type WorkflowMongoModel = TenantAwareMongoModel<WorkflowEntityProps>;
