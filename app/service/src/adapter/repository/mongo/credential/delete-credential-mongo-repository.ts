import { attemptAsync, isNotNil } from "es-toolkit";
import { err, ok } from "neverthrow";
import type { GetCredentialMongoCollection } from "@/adapter/repository/mongo/credential/credential-mongo-collection";
import { Err } from "@/common/err/err";
import {
  type DeleteCredentialRepository,
  deleteCredentialRepositorySchema,
} from "@/domain/port/credential/credential-repository";

type Input = {
  getCredentialMongoCollection: GetCredentialMongoCollection;
};

export const makeDeleteCredentialMongoRepository = ({
  getCredentialMongoCollection,
}: Input): DeleteCredentialRepository =>
  deleteCredentialRepositorySchema.implementAsync(async ({ ctx, id }) => {
    const collectionResult = await getCredentialMongoCollection({ ctx });

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
