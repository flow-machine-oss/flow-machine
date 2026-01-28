import { err, ok } from "neverthrow";
import type { FindWorkflowsRepository } from "@/domain/port/workflow/workflow-repository";
import {
  type ListWorkflowsUseCase,
  listWorkflowsUseCaseSchema,
} from "@/domain/port/workflow/workflow-use-case";

type Input = {
  findWorkflowsRepository: FindWorkflowsRepository;
};

export const makeListWorkflowsUseCase = ({
  findWorkflowsRepository,
}: Input): ListWorkflowsUseCase =>
  listWorkflowsUseCaseSchema.implementAsync(async ({ ctx }) => {
    const findResult = await findWorkflowsRepository({ ctx });

    if (findResult.isErr()) {
      return err(findResult.error);
    }
    return ok(findResult.value);
  });
