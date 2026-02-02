import { attemptAsync, isNotNil } from "es-toolkit";
import { err, ok } from "neverthrow";
import type { GetIssueMongoCollection } from "@/adapter/repository/mongo/issue/issue-mongo-collection";
import type { IssueEntityToMongoModel } from "@/adapter/repository/mongo/issue/issue-mongo-mapper";
import { Err } from "@/common/err/err";
import {
  type InsertIssueRepository,
  insertIssueRepositorySchema,
} from "@/domain/port/issue/issue-repository";

type Input = {
  getIssueMongoCollection: GetIssueMongoCollection;
  issueEntityToMongoModel: IssueEntityToMongoModel;
};

export const makeInsertIssueMongoRepository = ({
  getIssueMongoCollection,
  issueEntityToMongoModel,
}: Input): InsertIssueRepository =>
  insertIssueRepositorySchema.implementAsync(async ({ ctx, data }) => {
    const result = await getIssueMongoCollection({ ctx });

    if (result.isErr()) {
      return err(result.error);
    }
    const [error] = await attemptAsync(() =>
      result.value.insertOne(issueEntityToMongoModel(data)),
    );

    if (isNotNil(error)) {
      return err(Err.from(error));
    }
    return ok();
  });
