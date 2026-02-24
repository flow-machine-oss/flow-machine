import { attemptAsync, isNotNil } from "es-toolkit";
import { err, ok } from "neverthrow";
import type { GetAiAgentMongoCollection } from "@/adapter/repository/mongo/ai-agent/ai-agent-mongo-collection";
import { Err } from "@/common/err/err";
import { AiAgentEntity } from "@/domain/entity/ai-agent/ai-agent-entity";
import {
  type FindAiAgentByIdRepository,
  findAiAgentByIdRepositorySchema,
} from "@/domain/port/ai-agent/ai-agent-repository";

type Input = {
  getAiAgentMongoCollection: GetAiAgentMongoCollection;
};

export const makeFindAiAgentByIdMongoRepository = ({
  getAiAgentMongoCollection,
}: Input): FindAiAgentByIdRepository =>
  findAiAgentByIdRepositorySchema.implementAsync(async ({ ctx, id }) => {
    const collectionResult = await getAiAgentMongoCollection({ ctx });

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
    const entityResult = AiAgentEntity.makeExisting(
      doc._id,
      doc.createdAt,
      doc.updatedAt,
      doc.tenant,
      {
        name: doc.name,
        model: doc.model,
        projects: doc.projects,
      },
    );

    if (entityResult.isErr()) {
      return err(entityResult.error);
    }
    return ok(entityResult.value);
  });
