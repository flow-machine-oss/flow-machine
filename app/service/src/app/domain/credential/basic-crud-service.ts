import { isNil } from "es-toolkit";
import { err, ok } from "neverthrow";
import type z from "zod";
import { Err } from "@/common/err/err";
import type { CredentialCrudRepository } from "@/core/domain/credential/crud-repository";
import type {
  CredentialCrudService,
  credentialCrudServiceInputSchema,
} from "@/core/domain/credential/crud-service";
import { CredentialEntity } from "@/core/domain/credential/entity";

export class CredentialBasicCrudService implements CredentialCrudService {
  #credentialCrudRepository: CredentialCrudRepository;

  constructor(credentialCrudRepository: CredentialCrudRepository) {
    this.#credentialCrudRepository = credentialCrudRepository;
  }

  async create(input: z.infer<typeof credentialCrudServiceInputSchema.create>) {
    const { ctx, payload } = input;

    const newEntity = CredentialEntity.makeNew(ctx.tenant, payload);

    return await this.#credentialCrudRepository.insert({
      ctx,
      data: newEntity,
    });
  }

  async get(input: z.infer<typeof credentialCrudServiceInputSchema.get>) {
    const { ctx, payload } = input;
    const { id } = payload;

    const findOneResult = await this.#credentialCrudRepository.findOne({
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

  async list(input: z.infer<typeof credentialCrudServiceInputSchema.list>) {
    const { ctx } = input;

    return await this.#credentialCrudRepository.findMany({
      ctx,
    });
  }

  async update(input: z.infer<typeof credentialCrudServiceInputSchema.update>) {
    const { ctx, payload } = input;
    const { id, data } = payload;

    const findOneResult = await this.#credentialCrudRepository.findOne({
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
    maybeEntity.update(data);

    return await this.#credentialCrudRepository.update({
      ctx,
      id,
      data: maybeEntity,
    });
  }

  async delete(input: z.infer<typeof credentialCrudServiceInputSchema.delete>) {
    const { ctx, payload } = input;
    const { id } = payload;

    return await this.#credentialCrudRepository.delete({ ctx, id });
  }
}
