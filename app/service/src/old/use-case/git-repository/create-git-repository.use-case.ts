import { UTCDate } from "@date-fns/utc";
import { ResultAsync } from "neverthrow";
import type z from "zod";
import type { createGitRepositoryRequestBodySchema } from "@/old/dto/git-repository/create-git-repository.dto";
import type { Ctx } from "@/old/lib/ctx";
import { Err } from "@/old/lib/err";
import { newId } from "@/old/lib/id";
import type { WithOrganizationId } from "@/old/lib/type";
import {
  type GitRepositorySelect,
  gitRepositoryTable,
} from "@/old/schema/git-repository.schema";

type Payload = WithOrganizationId<{
  body: z.infer<typeof createGitRepositoryRequestBodySchema>;
}>;

export const createGitRepositoryUseCase = async (
  ctx: Ctx,
  { body, organizationId }: Payload,
) => {
  const newGitRepository = {
    id: newId(),
    createdAt: new UTCDate(),
    updatedAt: new UTCDate(),
    organizationId,

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
