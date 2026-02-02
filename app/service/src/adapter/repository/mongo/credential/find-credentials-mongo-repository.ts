import { attemptAsync, isNotNil } from "es-toolkit";
import { err, ok } from "neverthrow";
import type { GetCredentialMongoCollection } from "@/adapter/repository/mongo/credential/credential-mongo-collection";
import { credentialDocToProps } from "@/adapter/repository/mongo/credential/credential-mongo-mapper";
import { Err } from "@/common/err/err";
import { CredentialEntity } from "@/domain/entity/credential/credential-entity";
import {
  type FindCredentialsRepository,
  findCredentialsRepositorySchema,
} from "@/domain/port/credential/credential-repository";

type Input = {
  getCredentialMongoCollection: GetCredentialMongoCollection;
};

export const makeFindCredentialsMongoRepository = ({
  getCredentialMongoCollection,
}: Input): FindCredentialsRepository =>
  findCredentialsRepositorySchema.implementAsync(async ({ ctx }) => {
    const collectionResult = await getCredentialMongoCollection({ ctx });

    if (collectionResult.isErr()) {
      return err(collectionResult.error);
    }
    const [error, docs] = await attemptAsync(() =>
      collectionResult.value.find({ tenant: ctx.tenant }).toArray(),
    );

    if (isNotNil(error) || docs === null) {
      return err(Err.from(error));
    }
    const entities: CredentialEntity[] = [];

    for (const doc of docs) {
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
      entities.push(entityResult.value);
    }
    return ok(entities);
  });
