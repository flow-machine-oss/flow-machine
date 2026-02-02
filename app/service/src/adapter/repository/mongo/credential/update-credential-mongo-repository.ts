import { UTCDate } from "@date-fns/utc";
import { attemptAsync, isNotNil, isUndefined, omitBy } from "es-toolkit";
import { err, ok } from "neverthrow";
import type { GetCredentialMongoCollection } from "@/adapter/repository/mongo/credential/credential-mongo-collection";
import { Err } from "@/common/err/err";
import {
  type UpdateCredentialRepository,
  updateCredentialRepositorySchema,
} from "@/domain/port/credential/credential-repository";

type Input = {
  getCredentialMongoCollection: GetCredentialMongoCollection;
};

export const makeUpdateCredentialMongoRepository = ({
  getCredentialMongoCollection,
}: Input): UpdateCredentialRepository =>
  updateCredentialRepositorySchema.implementAsync(async ({ ctx, id, data }) => {
    const collectionResult = await getCredentialMongoCollection({ ctx });

    if (collectionResult.isErr()) {
      return err(collectionResult.error);
    }
    const updateData = omitBy(data, isUndefined);
    const [error] = await attemptAsync(() =>
      collectionResult.value.updateOne(
        { _id: id, tenant: ctx.tenant },
        { $set: { ...updateData, updatedAt: new UTCDate() } },
      ),
    );

    if (isNotNil(error)) {
      return err(Err.from(error));
    }
    return ok();
  });
