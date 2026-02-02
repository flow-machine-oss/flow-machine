import { attemptAsync, isNotNil } from "es-toolkit";
import { err, ok } from "neverthrow";
import type { GetIssueMongoCollection } from "@/adapter/repository/mongo/issue/issue-mongo-collection";
import type { IssueMongoModelToEntity } from "@/adapter/repository/mongo/issue/issue-mongo-mapper";
import { Err } from "@/common/err/err";
import {
  type FindIssuesRepository,
  findIssuesRepositorySchema,
} from "@/domain/port/issue/issue-repository";

type Input = {
  getIssueMongoCollection: GetIssueMongoCollection;
  issueMongoModelToEntity: IssueMongoModelToEntity;
};

export const makeFindIssuesMongoRepository = ({
  getIssueMongoCollection,
  issueMongoModelToEntity,
}: Input): FindIssuesRepository =>
  findIssuesRepositorySchema.implementAsync(async ({ ctx }) => {
    const collectionResult = await getIssueMongoCollection({
      ctx,
    });

    if (collectionResult.isErr()) {
      return err(collectionResult.error);
    }
    const [error, docs] = await attemptAsync(() =>
      collectionResult.value.find({ tenant: ctx.tenant }).toArray(),
    );

    if (isNotNil(error) || docs === null) {
      return err(Err.from(error));
    }
    return ok(docs.map((doc) => issueMongoModelToEntity(doc)));
  });
