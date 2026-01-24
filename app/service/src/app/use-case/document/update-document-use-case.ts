import { err, ok } from "neverthrow";
import type { UpdateDocumentRepository } from "@/domain/port/document/document-repository";
import {
  type UpdateDocumentUseCase,
  updateDocumentUseCaseSchema,
} from "@/domain/port/document/document-use-case";

type Input = {
  updateDocumentRepository: UpdateDocumentRepository;
};

export const makeUpdateDocumentUseCase = ({
  updateDocumentRepository,
}: Input): UpdateDocumentUseCase =>
  updateDocumentUseCaseSchema.implementAsync(async ({ ctx, payload }) => {
    const updateResult = await updateDocumentRepository({
      ctx,
      id: payload.id,
      data: {
        content: payload.content,
        projectId: payload.projectId,
        title: payload.title,
      },
    });

    if (updateResult.isErr()) {
      return err(updateResult.error);
    }
    return ok();
  });
