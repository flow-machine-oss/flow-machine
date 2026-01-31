import { UTCDate } from "@date-fns/utc";
import { attemptAsync, isNotNil, isUndefined, omitBy } from "es-toolkit";
import { err, ok } from "neverthrow";
import type { GetDocumentMongoCollection } from "@/adapter/repository/document/document-mongo-collection";
import { Err } from "@/common/err/err";
import {
  type UpdateDocumentRepository,
  updateDocumentRepositorySchema,
} from "@/domain/port/document/document-repository";

type Input = {
  getDocumentMongoCollection: GetDocumentMongoCollection;
};

export const makeUpdateDocumentMongoRepository = ({
  getDocumentMongoCollection,
}: Input): UpdateDocumentRepository =>
  updateDocumentRepositorySchema.implementAsync(async ({ ctx, id, data }) => {
    const collectionResult = await getDocumentMongoCollection({ ctx });

    if (collectionResult.isErr()) {
      return err(collectionResult.error);
    }
    const [error] = await attemptAsync(() =>
      collectionResult.value.updateOne(
        { _id: id, tenant: ctx.tenant },
        { $set: { ...omitBy(data, isUndefined), updatedAt: new UTCDate() } },
      ),
    );

    if (isNotNil(error)) {
      return err(Err.from(error));
    }
    return ok();
  });
