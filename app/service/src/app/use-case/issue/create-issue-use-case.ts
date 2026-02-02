import { err, ok } from "neverthrow";
import { IssueEntity } from "@/domain/entity/issue/issue-entity";
import type { InsertIssueRepository } from "@/domain/port/issue/issue-repository";
import {
  type CreateIssueUseCase,
  createIssueUseCaseSchema,
} from "@/domain/port/issue/issue-use-case";

type Input = {
  insertIssueRepository: InsertIssueRepository;
};

export const makeCreateIssueUseCase = ({
  insertIssueRepository,
}: Input): CreateIssueUseCase =>
  createIssueUseCaseSchema.implementAsync(async ({ ctx, payload }) => {
    const newEntity = IssueEntity.makeNew(ctx.tenant, {
      title: payload.title,
      description: payload.description,
      integration: payload.integration,
      projectId: payload.projectId,
    });
    const insertResult = await insertIssueRepository({
      ctx,
      data: newEntity,
    });

    if (insertResult.isErr()) {
      return err(insertResult.error);
    }
    return ok();
  });
