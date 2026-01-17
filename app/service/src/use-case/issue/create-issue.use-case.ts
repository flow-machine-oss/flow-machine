import { UTCDate } from "@date-fns/utc";
import { isNil } from "es-toolkit";
import { ResultAsync, err } from "neverthrow";
import type z from "zod";
import type { createIssueRequestBodySchema } from "@/dto/issue/create-issue.dto";
import type { currentUserSchema } from "@/guard/auth-check.guard";
import type { Ctx } from "@/lib/ctx";
import { Err } from "@/lib/err";
import { newId } from "@/lib/id";
import { issueTable } from "@/schema/issue.schema";

type Payload = {
  body: z.infer<typeof createIssueRequestBodySchema>;
  user: z.infer<typeof currentUserSchema>;
};

export const createIssueUseCase = async (ctx: Ctx, { body, user }: Payload) => {
  if (body.projectId) {
    const projectCheck = await ResultAsync.fromPromise(
      ctx.db.query.project.findFirst({
        where: { id: body.projectId, organizationId: user.organizationId },
      }),
      (e) => Err.from(e, { cause: e }),
    );

    if (projectCheck.isErr()) {
      return projectCheck;
    }

    if (isNil(projectCheck.value)) {
      return err(Err.code("notFound", { message: "Project not found" }));
    }
  }

  const newIssue = {
    id: newId(),
    createdAt: new UTCDate(),
    updatedAt: new UTCDate(),
    organizationId: user.organizationId,
    projectId: body.projectId ?? null,
  } as const;

  return ResultAsync.fromPromise(
    ctx.db.insert(issueTable).values(newIssue),
    (e) => Err.from(e, { cause: e }),
  );
};
