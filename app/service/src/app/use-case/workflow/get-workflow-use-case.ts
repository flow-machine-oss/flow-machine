import { err, ok } from "neverthrow";
import { Err } from "@/common/err/err";
import type { FindWorkflowByIdRepository } from "@/domain/port/workflow/workflow-repository";
import {
  type GetWorkflowUseCase,
  getWorkflowUseCaseSchema,
} from "@/domain/port/workflow/workflow-use-case";

type Input = {
  findWorkflowByIdRepository: FindWorkflowByIdRepository;
};

export const makeGetWorkflowUseCase = ({
  findWorkflowByIdRepository,
}: Input): GetWorkflowUseCase =>
  getWorkflowUseCaseSchema.implementAsync(async ({ ctx, payload }) => {
    const findResult = await findWorkflowByIdRepository({
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
  });
