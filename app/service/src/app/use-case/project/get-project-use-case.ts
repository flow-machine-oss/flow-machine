import { err, ok } from "neverthrow";
import { Err } from "@/common/err/err";
import type { FindProjectByIdRepository } from "@/domain/port/project/project-repository";
import {
  type GetProjectUseCase,
  getProjectUseCaseSchema,
} from "@/domain/port/project/project-use-case";

type Input = {
  findProjectByIdRepository: FindProjectByIdRepository;
};

export const makeGetProjectUseCase = ({
  findProjectByIdRepository,
}: Input): GetProjectUseCase =>
  getProjectUseCaseSchema.implementAsync(async ({ ctx, payload }) => {
    const findResult = await findProjectByIdRepository({
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
