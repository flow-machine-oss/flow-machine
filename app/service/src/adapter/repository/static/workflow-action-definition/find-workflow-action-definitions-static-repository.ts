import { ok } from "neverthrow";
import { WorkflowActionDefinitionEntity } from "@/domain/entity/workflow/workflow-action-definition-entity";
import {
  type FindWorkflowActionDefinitionsRepository,
  findWorkflowActionDefinitionsRepositorySchema,
} from "@/domain/port/workflow/workflow-action-definition-repository";

export const makeFindWorkflowActionDefinitionsStaticRepository =
  (): FindWorkflowActionDefinitionsRepository =>
    findWorkflowActionDefinitionsRepositorySchema.implementAsync(async () => {
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
