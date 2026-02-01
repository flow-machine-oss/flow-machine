import { attemptAsync, isNotNil } from "es-toolkit";
import { err, ok } from "neverthrow";
import type { GetAiAgentMongoCollection } from "@/adapter/repository/mongo/ai-agent/ai-agent-mongo-collection";
import { Err } from "@/common/err/err";
import {
  type DeleteAiAgentRepository,
  deleteAiAgentRepositorySchema,
} from "@/domain/port/ai-agent/ai-agent-repository";

type Input = {
  getAiAgentMongoCollection: GetAiAgentMongoCollection;
};

export const makeDeleteAiAgentMongoRepository = ({
  getAiAgentMongoCollection,
}: Input): DeleteAiAgentRepository =>
  deleteAiAgentRepositorySchema.implementAsync(async ({ ctx, id }) => {
    const collectionResult = await getAiAgentMongoCollection({ ctx });

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
