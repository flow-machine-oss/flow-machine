import { err, ok } from "neverthrow";
import type { FindProjectsRepository } from "@/domain/port/project/project-repository";
import {
  type ListProjectsUseCase,
  listProjectsUseCaseSchema,
} from "@/domain/port/project/project-use-case";

type Input = {
  findProjectsRepository: FindProjectsRepository;
};

export const makeListProjectsUseCase = ({
  findProjectsRepository,
}: Input): ListProjectsUseCase =>
  listProjectsUseCaseSchema.implementAsync(async ({ ctx }) => {
    const findResult = await findProjectsRepository({ ctx });

    if (findResult.isErr()) {
      return err(findResult.error);
    }
    return ok(findResult.value);
  });
