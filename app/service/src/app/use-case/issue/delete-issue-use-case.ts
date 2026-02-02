import { err, ok } from "neverthrow";
import type { DeleteIssueRepository } from "@/domain/port/issue/issue-repository";
import {
  type DeleteIssueUseCase,
  deleteIssueUseCaseSchema,
} from "@/domain/port/issue/issue-use-case";

type Input = {
  deleteIssueRepository: DeleteIssueRepository;
};

export const makeDeleteIssueUseCase = ({
  deleteIssueRepository,
}: Input): DeleteIssueUseCase =>
  deleteIssueUseCaseSchema.implementAsync(async ({ ctx, payload }) => {
    const deleteResult = await deleteIssueRepository({
      ctx,
      id: payload.id,
    });

    if (deleteResult.isErr()) {
      return err(deleteResult.error);
    }
    return ok();
  });
