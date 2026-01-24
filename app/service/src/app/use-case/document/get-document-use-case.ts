import { err, ok } from "neverthrow";
import { Err } from "@/common/err/err";
import type { FindDocumentByIdRepository } from "@/domain/port/document/document-repository";
import {
  type GetDocumentUseCase,
  getDocumentUseCaseSchema,
} from "@/domain/port/document/document-use-case";

type Input = {
  findDocumentByIdRepository: FindDocumentByIdRepository;
};

export const makeGetDocumentUseCase = ({
  findDocumentByIdRepository,
}: Input): GetDocumentUseCase =>
  getDocumentUseCaseSchema.implementAsync(async ({ ctx, payload }) => {
    const findResult = await findDocumentByIdRepository({
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
