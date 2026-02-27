import { ok } from "neverthrow";
import { WorkflowActionDefinitionEntity } from "@/domain/entity/workflow-action-definition/workflow-action-definition-entity";
import {
  type ListWorkflowActionDefinitionsUseCase,
  listWorkflowActionDefinitionsUseCaseSchema,
} from "@/domain/port/workflow-action-definition/workflow-action-definition-use-case";

export const makeListWorkflowActionDefinitionsUseCase =
  (): ListWorkflowActionDefinitionsUseCase =>
    listWorkflowActionDefinitionsUseCaseSchema.implementAsync(async () => {
      return ok([
        WorkflowActionDefinitionEntity.makeNew({
          name: "Research",
          kind: "research",
        }),
        WorkflowActionDefinitionEntity.makeNew({
          name: "Plan",
          kind: "plan",
        }),
        WorkflowActionDefinitionEntity.makeNew({
          name: "Code",
          kind: "code",
        }),
      ]);
    });
