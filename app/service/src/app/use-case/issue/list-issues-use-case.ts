import { err, ok } from "neverthrow";
import type { FindIssuesRepository } from "@/domain/port/issue/issue-repository";
import {
  type ListIssuesUseCase,
  listIssuesUseCaseSchema,
} from "@/domain/port/issue/issue-use-case";

type Input = {
  findIssuesRepository: FindIssuesRepository;
};

export const makeListIssuesUseCase = ({
  findIssuesRepository,
}: Input): ListIssuesUseCase =>
  listIssuesUseCaseSchema.implementAsync(async ({ ctx }) => {
    const findResult = await findIssuesRepository({ ctx });
    if (findResult.isErr()) {
      return err(findResult.error);
    }
    return ok(findResult.value);
  });
