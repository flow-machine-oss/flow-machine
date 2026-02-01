import { UTCDate } from "@date-fns/utc";
import { attemptAsync, isNotNil, isUndefined, omitBy } from "es-toolkit";
import { err, ok } from "neverthrow";
import type { GetAiAgentMongoCollection } from "@/adapter/repository/mongo/ai-agent/ai-agent-mongo-collection";
import { Err } from "@/common/err/err";
import {
  type UpdateAiAgentRepository,
  updateAiAgentRepositorySchema,
} from "@/domain/port/ai-agent/ai-agent-repository";

type Input = {
  getAiAgentMongoCollection: GetAiAgentMongoCollection;
};

export const makeUpdateAiAgentMongoRepository = ({
  getAiAgentMongoCollection,
}: Input): UpdateAiAgentRepository =>
  updateAiAgentRepositorySchema.implementAsync(async ({ ctx, id, data }) => {
    const collectionResult = await getAiAgentMongoCollection({ ctx });

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
