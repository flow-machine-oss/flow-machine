import type { EngineAction } from "@inngest/workflow-kit";
import z from "zod";
import { Entity } from "@/common/domain/entity";
import { type EntityId, newEntityId } from "@/common/domain/entity-id";

type Handler = (
  args: Parameters<EngineAction["handler"]>[0],
) => Promise<unknown>;

const workflowActionDefinitionEntityProps = z.object({
  kind: z.string(),
  name: z.string(),
  handler: z.custom<Handler>(),
});
type WorkflowActionDefinitionEntityProps = z.output<
  typeof workflowActionDefinitionEntityProps
>;

class WorkflowActionDefinitionEntity extends Entity<WorkflowActionDefinitionEntityProps> {
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

export {
  WorkflowActionDefinitionEntity,
  type WorkflowActionDefinitionEntityProps,
  workflowActionDefinitionEntityProps,
};
