import { attemptAsync, isNotNil } from "es-toolkit";
import { err, ok } from "neverthrow";
import type { GetDocumentMongoCollection } from "@/adapter/repository/document/document-mongo-collection";
import { Err } from "@/common/err/err";
import { DocumentEntity } from "@/domain/entity/document/document-entity";
import {
  type FindDocumentByIdRepository,
  findDocumentByIdRepositorySchema,
} from "@/domain/port/document/document-repository";

type Input = {
  getDocumentMongoCollection: GetDocumentMongoCollection;
};

export const makeFindDocumentByIdMongoRepository = ({
  getDocumentMongoCollection,
}: Input): FindDocumentByIdRepository =>
  findDocumentByIdRepositorySchema.implementAsync(async ({ ctx, id }) => {
    const collectionResult = await getDocumentMongoCollection({ ctx });

    if (collectionResult.isErr()) {
      return err(collectionResult.error);
    }
    const [error, doc] = await attemptAsync(() =>
      collectionResult.value.findOne({
        _id: id,
        tenant: ctx.tenant,
      }),
    );

    if (isNotNil(error)) {
      return err(Err.from(error));
    }
    if (doc === null) {
      return ok(null);
    }
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
    return ok(entityResult.value);
  });
