import { isNil } from "es-toolkit";
import { ResultAsync, err, ok } from "neverthrow";
import type z from "zod";
import type { currentUserSchema } from "@/guard/auth-check.guard";
import type { Ctx } from "@/lib/ctx";
import { Err } from "@/lib/err";

type Payload = {
  id: string;
  user: z.infer<typeof currentUserSchema>;
};

export const getGitRepositoryUseCase = async (
  ctx: Ctx,
  { id, user }: Payload,
) => {
  return ResultAsync.fromPromise(
    ctx.db.query.gitRepository.findFirst({
      where: { id, organizationId: user.organizationId },
      with: { gitRepositoryIntegration: true },
    }),
    (e) => Err.from(e),
  ).andThen((result) => {
    if (isNil(result)) {
      return err(Err.code("notFound"));
    }
    return ok(result);
  });
};
