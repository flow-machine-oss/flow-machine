import { attemptAsync, isNotNil } from "es-toolkit";
import { err, ok } from "neverthrow";
import type { GetAiAgentMongoCollection } from "@/adapter/repository/mongo/ai-agent/ai-agent-mongo-collection";
import { Err } from "@/common/err/err";
import { AiAgentEntity } from "@/domain/entity/ai-agent/ai-agent-entity";
import {
  type FindAiAgentsRepository,
  findAiAgentsRepositorySchema,
} from "@/domain/port/ai-agent/ai-agent-repository";

type Input = {
  getAiAgentMongoCollection: GetAiAgentMongoCollection;
};

export const makeFindAiAgentsMongoRepository = ({
  getAiAgentMongoCollection,
}: Input): FindAiAgentsRepository =>
  findAiAgentsRepositorySchema.implementAsync(async ({ ctx }) => {
    const collectionResult = await getAiAgentMongoCollection({ ctx });

    if (collectionResult.isErr()) {
      return err(collectionResult.error);
    }
    const [error, docs] = await attemptAsync(() =>
      collectionResult.value.find({ tenant: ctx.tenant }).toArray(),
    );

    if (isNotNil(error) || docs === null) {
      return err(Err.from(error));
    }
    const entities: AiAgentEntity[] = [];

    for (const doc of docs) {
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
      entities.push(entityResult.value);
    }
    return ok(entities);
  });
