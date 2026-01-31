import { err, ok } from "neverthrow";
import { Err } from "@/common/err/err";
import type { FindWorkflowDefinitionByIdRepository } from "@/domain/port/workflow/workflow-definition-repository";
import {
  type GetWorkflowDefinitionUseCase,
  getWorkflowDefinitionUseCaseSchema,
} from "@/domain/port/workflow/workflow-definition-use-case";

type Input = {
  findWorkflowDefinitionByIdRepository: FindWorkflowDefinitionByIdRepository;
};

export const makeGetWorkflowDefinitionUseCase = ({
  findWorkflowDefinitionByIdRepository,
}: Input): GetWorkflowDefinitionUseCase =>
  getWorkflowDefinitionUseCaseSchema.implementAsync(
    async ({ ctx, payload }) => {
      const findResult = await findWorkflowDefinitionByIdRepository({
        ctx,
        id: payload.id,
      });

      if (findResult.isErr()) {
        return err(findResult.error);
      }
      if (findResult.value === null) {
        return err(Err.code("notFound"));
      }
      return ok(findResult.value);
    },
  );
