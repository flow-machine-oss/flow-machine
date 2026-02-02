import { UTCDate } from "@date-fns/utc";
import { attemptAsync, isNotNil, isUndefined, omitBy } from "es-toolkit";
import { err, ok } from "neverthrow";
import type { GetIssueMongoCollection } from "@/adapter/repository/mongo/issue/issue-mongo-collection";
import { Err } from "@/common/err/err";
import {
  type UpdateIssueRepository,
  updateIssueRepositorySchema,
} from "@/domain/port/issue/issue-repository";

type Input = {
  getIssueMongoCollection: GetIssueMongoCollection;
};

export const makeUpdateIssueMongoRepository = ({
  getIssueMongoCollection,
}: Input): UpdateIssueRepository =>
  updateIssueRepositorySchema.implementAsync(async ({ ctx, id, data }) => {
    const collectionResult = await getIssueMongoCollection({
      ctx,
    });

    if (collectionResult.isErr()) {
      return err(collectionResult.error);
    }
    const [error] = await attemptAsync(() =>
      collectionResult.value.updateOne(
        { _id: id, tenant: ctx.tenant },
        { $set: { ...omitBy(data, isUndefined), updatedAt: new UTCDate() } },
      ),
    );

    if (isNotNil(error)) {
      return err(Err.from(error));
    }
    return ok();
  });
