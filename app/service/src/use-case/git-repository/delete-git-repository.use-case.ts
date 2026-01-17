import { and, eq } from "drizzle-orm";
import { isNil } from "es-toolkit";
import { ResultAsync, err } from "neverthrow";
import type z from "zod";
import type { currentUserSchema } from "@/guard/auth-check.guard";
import type { Ctx } from "@/lib/ctx";
import { Err } from "@/lib/err";
import { gitRepositoryTable } from "@/schema/git-repository.schema";

type Payload = {
  id: string;
  user: z.infer<typeof currentUserSchema>;
};

export const deleteGitRepositoryUseCase = async (
  ctx: Ctx,
  { id, user }: Payload,
) => {
  const existsResult = await ResultAsync.fromPromise(
    ctx.db.query.gitRepository.findFirst({
      where: { id, organizationId: user.organizationId },
    }),
    (e) => Err.from(e, { cause: e }),
  );

  if (existsResult.isErr()) {
    return existsResult;
  }

  if (isNil(existsResult.value)) {
    return err(Err.code("notFound"));
  }

  return ResultAsync.fromPromise(
    ctx.db
      .delete(gitRepositoryTable)
      .where(
        and(
          eq(gitRepositoryTable.id, id),
          eq(gitRepositoryTable.organizationId, user.organizationId),
        ),
      ),
    (e) => Err.from(e, { cause: e }),
  );
};
