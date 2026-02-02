import { attemptAsync, isNotNil } from "es-toolkit";
import { err, ok } from "neverthrow";
import type { GetIssueMongoCollection } from "@/adapter/repository/mongo/issue/issue-mongo-collection";
import type { IssueMongoModelToEntity } from "@/adapter/repository/mongo/issue/issue-mongo-mapper";
import { Err } from "@/common/err/err";
import {
  type FindIssueByIdRepository,
  findIssueByIdRepositorySchema,
} from "@/domain/port/issue/issue-repository";

type Input = {
  getIssueMongoCollection: GetIssueMongoCollection;
  issueMongoModelToEntity: IssueMongoModelToEntity;
};

export const makeFindIssueByIdMongoRepository = ({
  getIssueMongoCollection,
  issueMongoModelToEntity,
}: Input): FindIssueByIdRepository =>
  findIssueByIdRepositorySchema.implementAsync(async ({ ctx, id }) => {
    const collectionResult = await getIssueMongoCollection({
      ctx,
    });

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
    return ok(issueMongoModelToEntity(doc));
  });
