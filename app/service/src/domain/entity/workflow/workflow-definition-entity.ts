import z from "zod";
import {
  type EntityIdInput,
  entityIdSchema,
  newEntityId,
} from "@/common/domain/entity-id";
import {
  type Tenant,
  TenantAwareEntity,
} from "@/common/domain/tenant-aware-entity";

export const workflowActionSchema = z.object({
  id: z.string(),
  kind: z.string(),
  name: z.string(),
  inputs: z.record(z.string(), z.unknown()).optional(),
});
export type WorkflowAction = z.output<typeof workflowActionSchema>;

export const workflowEdgeSchema = z.object({
  from: z.string(),
  to: z.string(),
});
export type WorkflowEdge = z.output<typeof workflowEdgeSchema>;

export const workflowDefinitionEntityProps = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(2000).optional(),
  projectId: entityIdSchema.nullable(),
  actions: workflowActionSchema.array(),
  edges: workflowEdgeSchema.array(),
  isActive: z.boolean(),
});
export type WorkflowDefinitionEntityProps = z.output<
  typeof workflowDefinitionEntityProps
>;

export class WorkflowDefinitionEntity extends TenantAwareEntity<WorkflowDefinitionEntityProps> {
  static makeNew(tenant: Tenant, props: WorkflowDefinitionEntityProps) {
    return new WorkflowDefinitionEntity(newEntityId(), tenant, props);
  }

  static makeExisting(
    id: EntityIdInput,
    createdAt: Date,
    updatedAt: Date,
    tenant: Tenant,
    props: WorkflowDefinitionEntityProps,
  ) {
    return new WorkflowDefinitionEntity(id, tenant, props, {
      createdAt,
      updatedAt,
    });
  }
}
