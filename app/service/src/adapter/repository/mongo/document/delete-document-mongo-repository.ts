import { attemptAsync, isNotNil } from "es-toolkit";
import { err, ok } from "neverthrow";
import type { GetDocumentMongoCollection } from "@/adapter/repository/mongo/document/document-mongo-collection";
import { Err } from "@/common/err/err";
import {
  type DeleteDocumentRepository,
  deleteDocumentRepositorySchema,
} from "@/domain/port/document/document-repository";

type Input = {
  getDocumentMongoCollection: GetDocumentMongoCollection;
};

export const makeDeleteDocumentMongoRepository = ({
  getDocumentMongoCollection,
}: Input): DeleteDocumentRepository =>
  deleteDocumentRepositorySchema.implementAsync(async ({ ctx, id }) => {
    const collectionResult = await getDocumentMongoCollection({ ctx });

    if (collectionResult.isErr()) {
      return err(collectionResult.error);
    }
    const [error] = await attemptAsync(() =>
      collectionResult.value.deleteOne({
        _id: id,
        tenant: ctx.tenant,
      }),
    );

    if (isNotNil(error)) {
      return err(Err.from(error));
    }
    return ok();
  });
