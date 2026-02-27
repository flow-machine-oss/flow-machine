import { err, ok } from "neverthrow";
import type z from "zod";
import type { MongoCtx } from "@/common/ctx/mongo-ctx";
import { Err } from "@/common/err/err";
import { tenantAwareCollectionIndexes } from "@/common/mongo/mongo-index";
import { tenantAwareEntityToMongoModel } from "@/common/mongo/mongo-model";
import type {
  ProjectCrudRepository,
  projectCrudRepositoryInputSchema,
} from "@/v2/core/domain/project/crud-repository";
import { ProjectEntity } from "@/v2/core/domain/project/entity";
import type { ProjectMongoModel } from "@/v2/infra/mongo/project/model";

class ProjectMongoCrudRepository implements ProjectCrudRepository {
  async findMany(
    input: z.infer<typeof projectCrudRepositoryInputSchema.findMany>,
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
    input: z.infer<typeof projectCrudRepositoryInputSchema.findOne>,
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
    input: z.infer<typeof projectCrudRepositoryInputSchema.insert>,
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
    input: z.infer<typeof projectCrudRepositoryInputSchema.update>,
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
    input: z.infer<typeof projectCrudRepositoryInputSchema.delete>,
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
    const collection = mongoDb.collection<ProjectMongoModel>("project");
    await collection.createIndexes(tenantAwareCollectionIndexes);
    return collection;
  }

  #toDomain(model: ProjectMongoModel) {
    return ProjectEntity.makeExisting(
      model._id,
      model.createdAt,
      model.updatedAt,
      model.tenant,
      {
        name: model.name,
        integration: model.integration,
      },
    );
  }
}

export { ProjectMongoCrudRepository };
