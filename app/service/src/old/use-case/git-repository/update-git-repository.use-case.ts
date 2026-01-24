import { UTCDate } from "@date-fns/utc";
import { and, eq } from "drizzle-orm";
import { isNil } from "es-toolkit";
import { ResultAsync, err } from "neverthrow";
import type z from "zod";
import type { updateGitRepositoryRequestBodySchema } from "@/old/dto/git-repository/update-git-repository.dto";
import type { Ctx } from "@/old/lib/ctx";
import { Err } from "@/old/lib/err";
import type { WithOrganizationId } from "@/old/lib/type";
import { gitRepositoryTable } from "@/old/schema/git-repository.schema";

type Payload = WithOrganizationId<{
  id: string;
  body: z.infer<typeof updateGitRepositoryRequestBodySchema>;
}>;

export const updateGitRepositoryUseCase = async (
  ctx: Ctx,
  { id, body, organizationId }: Payload,
) => {
  const existsResult = await ResultAsync.fromPromise(
    ctx.db.query.gitRepository.findFirst({
      where: { id, organizationId },
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
          eq(gitRepositoryTable.organizationId, organizationId),
        ),
      ),
    (e) => Err.from(e, { cause: e }),
  );
};
