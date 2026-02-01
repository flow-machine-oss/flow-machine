import { attemptAsync, isNotNil } from "es-toolkit";
import { err, ok } from "neverthrow";
import type { GetAiAgentMongoCollection } from "@/adapter/repository/mongo/ai-agent/ai-agent-mongo-collection";
import { Err } from "@/common/err/err";
import { tenantAwareEntityToMongoModel } from "@/common/mongo/mongo-model";
import {
  type InsertAiAgentRepository,
  insertAiAgentRepositorySchema,
} from "@/domain/port/ai-agent/ai-agent-repository";

type Input = {
  getAiAgentMongoCollection: GetAiAgentMongoCollection;
};

export const makeInsertAiAgentMongoRepository = ({
  getAiAgentMongoCollection,
}: Input): InsertAiAgentRepository =>
  insertAiAgentRepositorySchema.implementAsync(async ({ ctx, data }) => {
    const result = await getAiAgentMongoCollection({ ctx });

    if (result.isErr()) {
      return err(result.error);
    }
    const [error] = await attemptAsync(() =>
      result.value.insertOne(tenantAwareEntityToMongoModel(data)),
    );

    if (isNotNil(error)) {
      return err(Err.from(error));
    }
    return ok();
  });
