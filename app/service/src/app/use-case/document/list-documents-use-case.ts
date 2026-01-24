import { err, ok } from "neverthrow";
import type { FindDocumentsRepository } from "@/domain/port/document/document-repository";
import {
  type ListDocumentsUseCase,
  listDocumentsUseCaseSchema,
} from "@/domain/port/document/document-use-case";

type Input = {
  findDocumentsRepository: FindDocumentsRepository;
};

export const makeListDocumentsUseCase = ({
  findDocumentsRepository,
}: Input): ListDocumentsUseCase =>
  listDocumentsUseCaseSchema.implementAsync(async ({ ctx }) => {
    const findResult = await findDocumentsRepository({ ctx });

    if (findResult.isErr()) {
      return err(findResult.error);
    }
    return ok(findResult.value);
  });
