import { err, ok } from "neverthrow";
import type z from "zod";
import type { MongoCtx } from "@/common/ctx/mongo-ctx";
import { Err } from "@/common/err/err";
import { tenantAwareCollectionIndexes } from "@/common/mongo/mongo-index";
import { tenantAwareEntityToMongoModel } from "@/common/mongo/mongo-model";
import type {
  GitRepositoryCrudRepository,
  gitRepositoryCrudRepositoryInputSchema,
} from "@/core/domain/git-repository/crud-repository";
import { GitRepositoryEntity } from "@/core/domain/git-repository/entity";
import type { GitRepositoryMongoModel } from "@/infra/mongo/git-repository/model";

class GitRepositoryMongoCrudRepository implements GitRepositoryCrudRepository {
  async findMany(
    input: z.infer<typeof gitRepositoryCrudRepositoryInputSchema.findMany>,
  ) {
    const { ctx } = input;

    try {
      const collection = await this.#getCollection(ctx);
      const result = await collection
        .find({ tenant: ctx.tenant }, { session: ctx.mongoClientSession })
        .toArray();
      return ok(result.map(this.#toDomain));
    } catch (error) {
      console.error(error);
      return err(Err.from(error));
    }
  }

  async findOne(
    input: z.infer<typeof gitRepositoryCrudRepositoryInputSchema.findOne>,
  ) {
    const { ctx, id } = input;

    try {
      const collection = await this.#getCollection(ctx);
      const result = await collection.findOne(
        { _id: id, tenant: ctx.tenant },
        { session: ctx.mongoClientSession },
      );
      return ok(result ? this.#toDomain(result) : null);
    } catch (error) {
      return err(Err.from(error));
    }
  }

  async insert(
    input: z.infer<typeof gitRepositoryCrudRepositoryInputSchema.insert>,
  ) {
    const { ctx, data } = input;

    try {
      const collection = await this.#getCollection(ctx);
      const model = tenantAwareEntityToMongoModel(data);
      await collection.insertOne(model, { session: ctx.mongoClientSession });
      return ok();
    } catch (error) {
      return err(Err.from(error));
    }
  }

  async update(
    input: z.infer<typeof gitRepositoryCrudRepositoryInputSchema.update>,
  ) {
    const { ctx, id, data } = input;

    try {
      const collection = await this.#getCollection(ctx);
      const model = tenantAwareEntityToMongoModel(data);
      await collection.replaceOne({ _id: id, tenant: ctx.tenant }, model, {
        session: ctx.mongoClientSession,
      });
      return ok();
    } catch (error) {
      return err(Err.from(error));
    }
  }

  async delete(
    input: z.infer<typeof gitRepositoryCrudRepositoryInputSchema.delete>,
  ) {
    const { ctx, id } = input;

    try {
      const collection = await this.#getCollection(ctx);
      await collection.deleteOne(
        { _id: id, tenant: ctx.tenant },
        { session: ctx.mongoClientSession },
      );
      return ok();
    } catch (error) {
      return err(Err.from(error));
    }
  }

  async #getCollection({ mongoDb }: MongoCtx) {
    const collection =
      mongoDb.collection<GitRepositoryMongoModel>("git-repository");
    await collection.createIndexes(tenantAwareCollectionIndexes);
    return collection;
  }

  #toDomain(model: GitRepositoryMongoModel) {
    return GitRepositoryEntity.makeExisting(
      model._id,
      model.createdAt,
      model.updatedAt,
      model.tenant,
      {
        name: model.name,
        url: model.url,
        config: model.config,
        integration: model.integration,
      },
    );
  }
}

export { GitRepositoryMongoCrudRepository };
