import { err, ok } from "neverthrow";
import { Err } from "@/common/err/err";
import type { FindIssueByIdRepository } from "@/domain/port/issue/issue-repository";
import {
  type GetIssueUseCase,
  getIssueUseCaseSchema,
} from "@/domain/port/issue/issue-use-case";

type Input = {
  findIssueByIdRepository: FindIssueByIdRepository;
};

export const makeGetIssueUseCase = ({
  findIssueByIdRepository,
}: Input): GetIssueUseCase =>
  getIssueUseCaseSchema.implementAsync(async ({ ctx, payload }) => {
    const findResult = await findIssueByIdRepository({
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
