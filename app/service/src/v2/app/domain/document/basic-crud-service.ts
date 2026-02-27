import { isNil } from "es-toolkit";
import { err, ok } from "neverthrow";
import type z from "zod";
import { Err } from "@/common/err/err";
import type { DocumentCrudRepository } from "@/v2/core/domain/document/crud-repository";
import type {
  DocumentCrudService,
  documentCrudServiceInputSchema,
} from "@/v2/core/domain/document/crud-service";
import { DocumentEntity } from "@/v2/core/domain/document/entity";

export class DocumentBasicCrudService implements DocumentCrudService {
  #documentCrudRepository: DocumentCrudRepository;

  constructor(documentCrudRepository: DocumentCrudRepository) {
    this.#documentCrudRepository = documentCrudRepository;
  }

  async create(input: z.infer<typeof documentCrudServiceInputSchema.create>) {
    const { ctx, payload } = input;
    const { content, projectId, title } = payload;

    const newEntity = DocumentEntity.makeNew(ctx.tenant, {
      content,
      projectId,
      title,
    });

    return await this.#documentCrudRepository.insert({
      ctx,
      data: newEntity,
    });
  }

  async get(input: z.infer<typeof documentCrudServiceInputSchema.get>) {
    const { ctx, payload } = input;
    const { id } = payload;

    const findOneResult = await this.#documentCrudRepository.findOne({
      ctx,
      id,
    });

    if (findOneResult.isErr()) {
      return err(findOneResult.error);
    }
    const maybeEntity = findOneResult.value;

    if (isNil(maybeEntity)) {
      return err(Err.code("notFound"));
    }
    return ok(maybeEntity);
  }

  async list(input: z.infer<typeof documentCrudServiceInputSchema.list>) {
    const { ctx } = input;

    return await this.#documentCrudRepository.findMany({
      ctx,
    });
  }

  async update(input: z.infer<typeof documentCrudServiceInputSchema.update>) {
    const { ctx, payload } = input;
    const { id, ...updatedProps } = payload;

    const findOneResult = await this.#documentCrudRepository.findOne({
      ctx,
      id,
    });

    if (findOneResult.isErr()) {
      return err(findOneResult.error);
    }
    const maybeEntity = findOneResult.value;

    if (isNil(maybeEntity)) {
      return err(Err.code("notFound"));
    }
    maybeEntity.update(updatedProps);

    return await this.#documentCrudRepository.update({
      ctx,
      id,
      data: maybeEntity,
    });
  }

  async delete(input: z.infer<typeof documentCrudServiceInputSchema.delete>) {
    const { ctx, payload } = input;
    const { id } = payload;

    return await this.#documentCrudRepository.delete({ ctx, id });
  }
}
