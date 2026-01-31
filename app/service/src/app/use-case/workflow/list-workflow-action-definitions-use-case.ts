import { err, ok } from "neverthrow";
import type { FindWorkflowActionDefinitionsRepository } from "@/domain/port/workflow/workflow-action-definition-repository";
import {
  type ListWorkflowActionDefinitionsUseCase,
  listWorkflowActionDefinitionsUseCaseSchema,
} from "@/domain/port/workflow/workflow-action-definition-use-case";

type Input = {
  findWorkflowActionDefinitionsRepository: FindWorkflowActionDefinitionsRepository;
};

export const makeListWorkflowActionDefinitionsUseCase = ({
  findWorkflowActionDefinitionsRepository,
}: Input): ListWorkflowActionDefinitionsUseCase =>
  listWorkflowActionDefinitionsUseCaseSchema.implementAsync(async ({ ctx }) => {
    const findResult = await findWorkflowActionDefinitionsRepository({ ctx });

    if (findResult.isErr()) {
      return err(findResult.error);
    }
    return ok(findResult.value);
  });
