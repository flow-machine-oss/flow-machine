import { UTCDate } from "@date-fns/utc";
import z from "zod";
import {
  type EntityId,
  entityIdSchema,
  newEntityId,
} from "@/core/domain/entity";
import {
  type Tenant,
  TenantAwareEntity,
} from "@/core/domain/tenant-aware-entity";

const workflowActionSchema = z.object({
  id: z.string(),
  kind: z.string(),
  name: z.string(),
  inputs: z.record(z.string(), z.unknown()).optional(),
});
type WorkflowAction = z.output<typeof workflowActionSchema>;

const workflowEdgeSchema = z.object({
  from: z.string(),
  to: z.string(),
});
type WorkflowEdge = z.output<typeof workflowEdgeSchema>;

const workflowDefinitionEntityProps = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(2000).optional(),
  projects: z
    .object({
      id: entityIdSchema,
      syncStatus: z.enum(["idle", "pending", "success", "error"]),
      syncedAt: z.date().nullable(),
    })
    .array(),
  actions: workflowActionSchema.array(),
  edges: workflowEdgeSchema.array(),
  isActive: z.boolean(),
});
type WorkflowDefinitionEntityProps = z.output<
  typeof workflowDefinitionEntityProps
>;

class WorkflowDefinitionEntity extends TenantAwareEntity<WorkflowDefinitionEntityProps> {
  static makeNew(tenant: Tenant, props: WorkflowDefinitionEntityProps) {
    return new WorkflowDefinitionEntity(newEntityId(), tenant, props);
  }

  static makeExisting(
    id: EntityId,
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

  markProjectForSync({ projectId }: { projectId: EntityId }) {
    const project = this.props.projects.find((p) => p.id === projectId);
    if (!project) {
      return;
    }
    project.syncStatus = "pending";
    this.updatedAt = new UTCDate();
  }

  markProjectAsSynced({ projectId }: { projectId: EntityId }) {
    const project = this.props.projects.find((p) => p.id === projectId);
    if (!project) {
      return;
    }
    project.syncStatus = "success";
    project.syncedAt = new UTCDate();
    this.updatedAt = new UTCDate();
  }

  markProjectSyncError({ projectId }: { projectId: EntityId }) {
    const project = this.props.projects.find((p) => p.id === projectId);
    if (!project) {
      return;
    }
    project.syncStatus = "error";
    this.updatedAt = new UTCDate();
  }
}

export {
  WorkflowDefinitionEntity,
  workflowDefinitionEntityProps,
  type WorkflowDefinitionEntityProps,
  workflowActionSchema,
  type WorkflowAction,
  workflowEdgeSchema,
  type WorkflowEdge,
};
