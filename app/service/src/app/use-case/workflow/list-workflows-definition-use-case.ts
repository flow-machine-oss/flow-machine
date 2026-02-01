import { err, ok } from "neverthrow";
import type { FindWorkflowDefinitionsRepository } from "@/domain/port/workflow/workflow-definition-repository";
import {
  type ListWorkflowDefinitionsUseCase,
  listWorkflowDefinitionsUseCaseSchema,
} from "@/domain/port/workflow/workflow-definition-use-case";

type Input = {
  findWorkflowDefinitionsRepository: FindWorkflowDefinitionsRepository;
};

export const makeListWorkflowDefinitionsUseCase = ({
  findWorkflowDefinitionsRepository,
}: Input): ListWorkflowDefinitionsUseCase =>
  listWorkflowDefinitionsUseCaseSchema.implementAsync(async ({ ctx }) => {
    const findResult = await findWorkflowDefinitionsRepository({ ctx });
    if (findResult.isErr()) {
      return err(findResult.error);
    }
    return ok(findResult.value);
  });
