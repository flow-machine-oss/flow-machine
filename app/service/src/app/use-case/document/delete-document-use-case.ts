import { err, ok } from "neverthrow";
import type { DeleteDocumentRepository } from "@/domain/port/document/document-repository";
import {
  type DeleteDocumentUseCase,
  deleteDocumentUseCaseSchema,
} from "@/domain/port/document/document-use-case";

type Input = {
  deleteDocumentRepository: DeleteDocumentRepository;
};

export const makeDeleteDocumentUseCase = ({
  deleteDocumentRepository,
}: Input): DeleteDocumentUseCase =>
  deleteDocumentUseCaseSchema.implementAsync(async ({ ctx, payload }) => {
    const deleteResult = await deleteDocumentRepository({
      ctx,
      id: payload.id,
    });

    if (deleteResult.isErr()) {
      return err(deleteResult.error);
    }
    return ok();
  });
