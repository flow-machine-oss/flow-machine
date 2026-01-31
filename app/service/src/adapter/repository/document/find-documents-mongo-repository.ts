import { attemptAsync, isNotNil } from "es-toolkit";
import { err, ok } from "neverthrow";
import type { GetDocumentMongoCollection } from "@/adapter/repository/document/document-mongo-collection";
import { Err } from "@/common/err/err";
import { DocumentEntity } from "@/domain/entity/document/document-entity";
import {
  type FindDocumentsRepository,
  findDocumentsRepositorySchema,
} from "@/domain/port/document/document-repository";

type Input = {
  getDocumentMongoCollection: GetDocumentMongoCollection;
};

export const makeFindDocumentsMongoRepository = ({
  getDocumentMongoCollection,
}: Input): FindDocumentsRepository =>
  findDocumentsRepositorySchema.implementAsync(async ({ ctx }) => {
    const collectionResult = await getDocumentMongoCollection({ ctx });

    if (collectionResult.isErr()) {
      return err(collectionResult.error);
    }
    const [error, docs] = await attemptAsync(() =>
      collectionResult.value.find({ tenant: ctx.tenant }).toArray(),
    );

    if (isNotNil(error) || docs === null) {
      return err(Err.from(error));
    }
    const entities: DocumentEntity[] = [];

    for (const doc of docs) {
      const entityResult = DocumentEntity.makeExisting(
        doc._id,
        doc.createdAt,
        doc.updatedAt,
        doc.tenant,
        {
          content: doc.content,
          projectId: doc.projectId,
          title: doc.title,
        },
      );

      if (entityResult.isErr()) {
        return err(entityResult.error);
      }
      entities.push(entityResult.value);
    }
    return ok(entities);
  });
