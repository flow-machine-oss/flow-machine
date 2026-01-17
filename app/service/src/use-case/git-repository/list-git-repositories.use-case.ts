import { ResultAsync } from "neverthrow";
import type z from "zod";
import type { currentUserSchema } from "@/guard/auth-check.guard";
import type { Ctx } from "@/lib/ctx";
import { Err } from "@/lib/err";

type Payload = {
  user: z.infer<typeof currentUserSchema>;
};

export const listGitRepositoriesUseCase = async (
  ctx: Ctx,
  { user }: Payload,
) => {
  return ResultAsync.fromPromise(
    ctx.db.query.gitRepository.findMany({
      where: { organizationId: user.organizationId },
      orderBy: { createdAt: "desc" },
      with: { gitRepositoryIntegration: true },
    }),
    (e) => Err.from(e, { cause: e }),
  );
};
