import { randomUUIDv7 } from "bun";
import { describe, expect, mock, test } from "bun:test";
import { err, ok } from "neverthrow";
import { Err } from "@/common/err/err";
import type { ProjectCrudRepository } from "@/core/domain/project/crud-repository";
import { ProjectEntity } from "@/core/domain/project/entity";
import { ProjectBasicCrudService } from "./basic-crud-service";

function makeCtx() {
  return {
    tenant: { id: randomUUIDv7(), type: "organization" as const },
  };
}

function makeMockRepository(): ProjectCrudRepository {
  return {
    insert: mock(() => Promise.resolve(ok(undefined))),
    findOne: mock(() => Promise.resolve(ok(null))),
    findMany: mock(() => Promise.resolve(ok([]))),
    update: mock(() => Promise.resolve(ok(undefined))),
    delete: mock(() => Promise.resolve(ok(undefined))),
  };
}

describe("ProjectBasicCrudService", () => {
  describe("create", () => {
    test("calls insert with a ProjectEntity and returns ok", async () => {
      const repo = makeMockRepository();
      const service = new ProjectBasicCrudService(repo);
      const ctx = makeCtx();

      const result = await service.create({
        ctx,
        payload: { name: "My Project" },
      });

      expect(result.isOk()).toBe(true);
      expect(repo.insert).toHaveBeenCalledTimes(1);
      const call = (repo.insert as ReturnType<typeof mock>).mock.calls[0]!;
      expect(call[0].ctx).toBe(ctx);
      expect(call[0].data).toBeInstanceOf(ProjectEntity);
      expect(call[0].data.props.name).toBe("My Project");
    });

    test("propagates repository error", async () => {
      const repoErr = Err.code("unknown");
      const repo = makeMockRepository();
      (repo.insert as ReturnType<typeof mock>).mockResolvedValue(err(repoErr));
      const service = new ProjectBasicCrudService(repo);

      const result = await service.create({
        ctx: makeCtx(),
        payload: { name: "My Project" },
      });

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toBe(repoErr);
    });
  });

  describe("get", () => {
    test("returns entity when found", async () => {
      const ctx = makeCtx();
      const entity = ProjectEntity.makeNew(ctx.tenant, { name: "Found" });
      const repo = makeMockRepository();
      (repo.findOne as ReturnType<typeof mock>).mockResolvedValue(ok(entity));
      const service = new ProjectBasicCrudService(repo);

      const result = await service.get({
        ctx,
        payload: { id: entity.id },
      });

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(entity);
    });

    test("returns notFound error when entity is null", async () => {
      const repo = makeMockRepository();
      (repo.findOne as ReturnType<typeof mock>).mockResolvedValue(ok(null));
      const service = new ProjectBasicCrudService(repo);

      const result = await service.get({
        ctx: makeCtx(),
        payload: { id: randomUUIDv7() },
      });

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().code).toBe("notFound");
    });

    test("propagates repository error", async () => {
      const repoErr = Err.code("unknown");
      const repo = makeMockRepository();
      (repo.findOne as ReturnType<typeof mock>).mockResolvedValue(err(repoErr));
      const service = new ProjectBasicCrudService(repo);

      const result = await service.get({
        ctx: makeCtx(),
        payload: { id: randomUUIDv7() },
      });

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toBe(repoErr);
    });
  });

  describe("list", () => {
    test("returns array of entities", async () => {
      const ctx = makeCtx();
      const entities = [
        ProjectEntity.makeNew(ctx.tenant, { name: "A" }),
        ProjectEntity.makeNew(ctx.tenant, { name: "B" }),
      ];
      const repo = makeMockRepository();
      (repo.findMany as ReturnType<typeof mock>).mockResolvedValue(
        ok(entities),
      );
      const service = new ProjectBasicCrudService(repo);

      const result = await service.list({ ctx });

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(entities);
    });

    test("propagates repository error", async () => {
      const repoErr = Err.code("unknown");
      const repo = makeMockRepository();
      (repo.findMany as ReturnType<typeof mock>).mockResolvedValue(
        err(repoErr),
      );
      const service = new ProjectBasicCrudService(repo);

      const result = await service.list({ ctx: makeCtx() });

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toBe(repoErr);
    });
  });

  describe("update", () => {
    test("finds entity, updates it, and persists via repository", async () => {
      const ctx = makeCtx();
      const entity = ProjectEntity.makeNew(ctx.tenant, {
        name: "Original",
      });
      const repo = makeMockRepository();
      (repo.findOne as ReturnType<typeof mock>).mockResolvedValue(ok(entity));
      const service = new ProjectBasicCrudService(repo);

      const result = await service.update({
        ctx,
        payload: { id: entity.id, name: "Updated" },
      });

      expect(result.isOk()).toBe(true);
      expect(entity.props.name).toBe("Updated");
      expect(repo.update).toHaveBeenCalledTimes(1);
      const call = (repo.update as ReturnType<typeof mock>).mock.calls[0]!;
      expect(call[0].data).toBe(entity);
    });

    test("returns notFound when entity is null", async () => {
      const repo = makeMockRepository();
      (repo.findOne as ReturnType<typeof mock>).mockResolvedValue(ok(null));
      const service = new ProjectBasicCrudService(repo);

      const result = await service.update({
        ctx: makeCtx(),
        payload: { id: randomUUIDv7(), name: "Updated" },
      });

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().code).toBe("notFound");
      expect(repo.update).not.toHaveBeenCalled();
    });

    test("propagates findOne error", async () => {
      const repoErr = Err.code("unknown");
      const repo = makeMockRepository();
      (repo.findOne as ReturnType<typeof mock>).mockResolvedValue(err(repoErr));
      const service = new ProjectBasicCrudService(repo);

      const result = await service.update({
        ctx: makeCtx(),
        payload: { id: randomUUIDv7(), name: "Updated" },
      });

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toBe(repoErr);
      expect(repo.update).not.toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    test("delegates to repository", async () => {
      const repo = makeMockRepository();
      const service = new ProjectBasicCrudService(repo);
      const ctx = makeCtx();
      const id = randomUUIDv7();

      const result = await service.delete({
        ctx,
        payload: { id },
      });

      expect(result.isOk()).toBe(true);
      expect(repo.delete).toHaveBeenCalledTimes(1);
    });

    test("propagates repository error", async () => {
      const repoErr = Err.code("unknown");
      const repo = makeMockRepository();
      (repo.delete as ReturnType<typeof mock>).mockResolvedValue(err(repoErr));
      const service = new ProjectBasicCrudService(repo);

      const result = await service.delete({
        ctx: makeCtx(),
        payload: { id: randomUUIDv7() },
      });

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toBe(repoErr);
    });
  });
});
