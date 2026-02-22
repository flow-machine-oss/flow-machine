import z from "zod";
import { Entity } from "@/common/domain/entity";
import { type EntityId, newEntityId } from "@/common/domain/entity-id";

export const workflowActionDefinitionEntityProps = z.object({
  kind: z.string(),
  name: z.string(),
});
export type WorkflowActionDefinitionEntityProps = z.output<
  typeof workflowActionDefinitionEntityProps
>;

export class WorkflowActionDefinitionEntity extends Entity<WorkflowActionDefinitionEntityProps> {
  static makeNew(props: WorkflowActionDefinitionEntityProps) {
    return new WorkflowActionDefinitionEntity(newEntityId(), props);
  }

  static makeExisting(
    id: EntityId,
    createdAt: Date,
    updatedAt: Date,
    props: WorkflowActionDefinitionEntityProps,
  ) {
    return new WorkflowActionDefinitionEntity(id, props, {
      createdAt,
      updatedAt,
    });
  }
}
