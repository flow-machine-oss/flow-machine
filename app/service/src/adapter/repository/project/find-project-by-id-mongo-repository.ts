import { attemptAsync, isNotNil } from "es-toolkit";
import { err, ok } from "neverthrow";
import type { GetProjectMongoCollection } from "@/adapter/repository/project/project-mongo-collection";
import { Err } from "@/common/err/err";
import { ProjectEntity } from "@/domain/entity/project/project-entity";
import {
  type FindProjectByIdRepository,
  findProjectByIdRepositorySchema,
} from "@/domain/port/project/project-repository";

type Input = {
  getProjectMongoCollection: GetProjectMongoCollection;
};

export const makeFindProjectByIdMongoRepository = ({
  getProjectMongoCollection,
}: Input): FindProjectByIdRepository =>
  findProjectByIdRepositorySchema.implementAsync(async ({ ctx, id }) => {
    const collectionResult = await getProjectMongoCollection({ ctx });

    if (collectionResult.isErr()) {
      return err(collectionResult.error);
    }
    const [error, doc] = await attemptAsync(() =>
      collectionResult.value.findOne({
        _id: id,
        "tenant.id": ctx.tenant.id,
      }),
    );

    if (isNotNil(error)) {
      return err(Err.from(error));
    }
    if (doc === null) {
      return ok(null);
    }
    const entityResult = ProjectEntity.makeExisting(
      doc._id,
      doc.createdAt,
      doc.updatedAt,
      doc.tenant,
      {
        name: doc.name,
        integration: doc.integration,
      },
    );

    if (entityResult.isErr()) {
      return err(entityResult.error);
    }
    return ok(entityResult.value);
  });
