import { attemptAsync, isNotNil } from "es-toolkit";
import { err, ok } from "neverthrow";
import type { GetCredentialMongoCollection } from "@/adapter/repository/mongo/credential/credential-mongo-collection";
import { credentialEntityToMongoModel } from "@/adapter/repository/mongo/credential/credential-mongo-mapper";
import { Err } from "@/common/err/err";
import {
  type InsertCredentialRepository,
  insertCredentialRepositorySchema,
} from "@/domain/port/credential/credential-repository";

type Input = {
  getCredentialMongoCollection: GetCredentialMongoCollection;
};

export const makeInsertCredentialMongoRepository = ({
  getCredentialMongoCollection,
}: Input): InsertCredentialRepository =>
  insertCredentialRepositorySchema.implementAsync(async ({ ctx, data }) => {
    const result = await getCredentialMongoCollection({ ctx });

    if (result.isErr()) {
      return err(result.error);
    }
    const [error] = await attemptAsync(() =>
      result.value.insertOne(credentialEntityToMongoModel(data)),
    );

    if (isNotNil(error)) {
      return err(Err.from(error));
    }
    return ok();
  });
