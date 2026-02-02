import { err, ok } from "neverthrow";
import type { UpdateIssueRepository } from "@/domain/port/issue/issue-repository";
import {
  type UpdateIssueUseCase,
  updateIssueUseCaseSchema,
} from "@/domain/port/issue/issue-use-case";

type Input = {
  updateIssueRepository: UpdateIssueRepository;
};

export const makeUpdateIssueUseCase = ({
  updateIssueRepository,
}: Input): UpdateIssueUseCase =>
  updateIssueUseCaseSchema.implementAsync(async ({ ctx, payload }) => {
    const updateResult = await updateIssueRepository({
      ctx,
      id: payload.id,
      data: {
        title: payload.title,
        description: payload.description,
        integration: payload.integration,
        projectId: payload.projectId,
      },
    });

    if (updateResult.isErr()) {
      return err(updateResult.error);
    }
    return ok();
  });
