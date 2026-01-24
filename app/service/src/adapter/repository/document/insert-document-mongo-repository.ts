import { attemptAsync, isNotNil } from "es-toolkit";
import { err, ok } from "neverthrow";
import type { GetDocumentMongoCollection } from "@/adapter/repository/document/document-mongo-collection";
import { Err } from "@/common/err/err";
import { tenantAwareEntityToMongoModel } from "@/common/mongo/mongo-model";
import {
  type InsertDocumentRepository,
  insertDocumentRepositorySchema,
} from "@/domain/port/document/document-repository";

type Input = {
  getDocumentMongoCollection: GetDocumentMongoCollection;
};

export const makeInsertDocumentMongoRepository = ({
  getDocumentMongoCollection,
}: Input): InsertDocumentRepository =>
  insertDocumentRepositorySchema.implementAsync(async ({ ctx, data }) => {
    const result = await getDocumentMongoCollection({ ctx });

    if (result.isErr()) {
      return err(result.error);
    }
    const [error] = await attemptAsync(() =>
      result.value.insertOne(tenantAwareEntityToMongoModel(data)),
    );

    if (isNotNil(error)) {
      return err(Err.from(error));
    }
    return ok();
  });
