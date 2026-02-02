import { attemptAsync, isNotNil } from "es-toolkit";
import { err, ok } from "neverthrow";
import type { GetIssueMongoCollection } from "@/adapter/repository/mongo/issue/issue-mongo-collection";
import { Err } from "@/common/err/err";
import {
  type DeleteIssueRepository,
  deleteIssueRepositorySchema,
} from "@/domain/port/issue/issue-repository";

type Input = {
  getIssueMongoCollection: GetIssueMongoCollection;
};

export const makeDeleteIssueMongoRepository = ({
  getIssueMongoCollection,
}: Input): DeleteIssueRepository =>
  deleteIssueRepositorySchema.implementAsync(async ({ ctx, id }) => {
    const collectionResult = await getIssueMongoCollection({
      ctx,
    });

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
