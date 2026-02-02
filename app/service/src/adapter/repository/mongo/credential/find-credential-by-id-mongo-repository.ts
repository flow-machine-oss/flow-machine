import { attemptAsync, isNotNil } from "es-toolkit";
import { err, ok } from "neverthrow";
import type { GetCredentialMongoCollection } from "@/adapter/repository/mongo/credential/credential-mongo-collection";
import { credentialDocToProps } from "@/adapter/repository/mongo/credential/credential-mongo-mapper";
import { Err } from "@/common/err/err";
import { CredentialEntity } from "@/domain/entity/credential/credential-entity";
import {
  type FindCredentialByIdRepository,
  findCredentialByIdRepositorySchema,
} from "@/domain/port/credential/credential-repository";

type Input = {
  getCredentialMongoCollection: GetCredentialMongoCollection;
};

export const makeFindCredentialByIdMongoRepository = ({
  getCredentialMongoCollection,
}: Input): FindCredentialByIdRepository =>
  findCredentialByIdRepositorySchema.implementAsync(async ({ ctx, id }) => {
    const collectionResult = await getCredentialMongoCollection({ ctx });

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
    const entityResult = CredentialEntity.makeExisting(
      doc._id,
      doc.createdAt,
      doc.updatedAt,
      doc.tenant,
      credentialDocToProps(doc),
    );

    if (entityResult.isErr()) {
      return err(entityResult.error);
    }
    return ok(entityResult.value);
  });
