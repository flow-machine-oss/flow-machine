import { attemptAsync, isNotNil } from "es-toolkit";
import { err, ok } from "neverthrow";
import type { GetProjectMongoCollection } from "@/adapter/repository/mongo/project/project-mongo-collection";
import { Err } from "@/common/err/err";
import { ProjectEntity } from "@/domain/entity/project/project-entity";
import {
  type FindProjectsRepository,
  findProjectsRepositorySchema,
} from "@/domain/port/project/project-repository";

type Input = {
  getProjectMongoCollection: GetProjectMongoCollection;
};

export const makeFindProjectsMongoRepository = ({
  getProjectMongoCollection,
}: Input): FindProjectsRepository =>
  findProjectsRepositorySchema.implementAsync(async ({ ctx }) => {
    const collectionResult = await getProjectMongoCollection({ ctx });

    if (collectionResult.isErr()) {
      return err(collectionResult.error);
    }
    const [error, docs] = await attemptAsync(() =>
      collectionResult.value.find({ tenant: ctx.tenant }).toArray(),
    );

    if (isNotNil(error) || docs === null) {
      return err(Err.from(error));
    }
    const entities: ProjectEntity[] = [];

    for (const doc of docs) {
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
      entities.push(entityResult.value);
    }
    return ok(entities);
  });
