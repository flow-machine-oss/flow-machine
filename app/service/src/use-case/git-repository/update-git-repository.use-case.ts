import { UTCDate } from "@date-fns/utc";
import { and, eq } from "drizzle-orm";
import { isNil } from "es-toolkit";
import { ResultAsync, err } from "neverthrow";
import type z from "zod";
import type { updateGitRepositoryRequestBodySchema } from "@/dto/git-repository/update-git-repository.dto";
import type { currentUserSchema } from "@/guard/auth-check.guard";
import type { Ctx } from "@/lib/ctx";
import { Err } from "@/lib/err";
import { gitRepositoryTable } from "@/schema/git-repository.schema";

type Payload = {
  id: string;
  body: z.infer<typeof updateGitRepositoryRequestBodySchema>;
  user: z.infer<typeof currentUserSchema>;
};

export const updateGitRepositoryUseCase = async (
  ctx: Ctx,
  { id, body, user }: Payload,
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
      .update(gitRepositoryTable)
      .set({
        ...body,
        updatedAt: new UTCDate(),
      })
      .where(
        and(
          eq(gitRepositoryTable.id, id),
          eq(gitRepositoryTable.organizationId, user.organizationId),
        ),
      ),
    (e) => Err.from(e, { cause: e }),
  );
};
