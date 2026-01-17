import { UTCDate } from "@date-fns/utc";
import { ResultAsync } from "neverthrow";
import type z from "zod";
import type { createGitRepositoryRequestBodySchema } from "@/dto/git-repository/create-git-repository.dto";
import type { currentUserSchema } from "@/guard/auth-check.guard";
import type { Ctx } from "@/lib/ctx";
import { Err } from "@/lib/err";
import { newId } from "@/lib/id";
import {
  type GitRepositorySelect,
  gitRepositoryTable,
} from "@/schema/git-repository.schema";

type Payload = {
  body: z.infer<typeof createGitRepositoryRequestBodySchema>;
  user: z.infer<typeof currentUserSchema>;
};

export const createGitRepositoryUseCase = async (
  ctx: Ctx,
  { body, user }: Payload,
) => {
  const newGitRepository = {
    id: newId(),
    createdAt: new UTCDate(),
    updatedAt: new UTCDate(),
    organizationId: user.organizationId,

    contributorEmail: body.contributorEmail,
    contributorName: body.contributorName,
    name: body.name,
    url: body.url,
  } as const satisfies GitRepositorySelect;

  return ResultAsync.fromPromise(
    ctx.db.insert(gitRepositoryTable).values(newGitRepository),
    (e) => Err.from(e, { cause: e }),
  );
};
