import { err, ok } from "neverthrow";
import { DocumentEntity } from "@/domain/entity/document/document-entity";
import type { InsertDocumentRepository } from "@/domain/port/document/document-repository";
import {
  type CreateDocumentUseCase,
  createDocumentUseCaseSchema,
} from "@/domain/port/document/document-use-case";

type Input = {
  insertDocumentRepository: InsertDocumentRepository;
};

export const makeCreateDocumentUseCase = ({
  insertDocumentRepository,
}: Input): CreateDocumentUseCase =>
  createDocumentUseCaseSchema.implementAsync(async ({ ctx, payload }) => {
    const makeNewEntityResult = DocumentEntity.makeNew(ctx.tenantId, {
      content: payload.content,
      projectId: payload.projectId,
      title: payload.title,
    });

    if (makeNewEntityResult.isErr()) {
      return err(makeNewEntityResult.error);
    }
    const insertResult = await insertDocumentRepository({
      ctx,
      data: makeNewEntityResult.value,
    });

    if (insertResult.isErr()) {
      return err(insertResult.error);
    }
    return ok();
  });
