import { UTCDate } from "@date-fns/utc";
import { and, eq } from "drizzle-orm";
import { isNil } from "es-toolkit";
import { ResultAsync, err } from "neverthrow";
import type z from "zod";
import type { updateIssueRequestBodySchema } from "@/dto/issue/update-issue.dto";
import type { currentUserSchema } from "@/guard/auth-check.guard";
import type { Ctx } from "@/lib/ctx";
import { Err } from "@/lib/err";
import { issueTable } from "@/schema/issue.schema";

type Payload = {
  id: string;
  body: z.infer<typeof updateIssueRequestBodySchema>;
  user: z.infer<typeof currentUserSchema>;
};

export const updateIssueUseCase = async (
  ctx: Ctx,
  { id, body, user }: Payload,
) => {
  const existsResult = await ResultAsync.fromPromise(
    ctx.db.query.issue.findFirst({
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

  return ResultAsync.fromPromise(
    ctx.db
      .update(issueTable)
      .set({
        ...body,
        updatedAt: new UTCDate(),
      })
      .where(
        and(
          eq(issueTable.id, id),
          eq(issueTable.organizationId, user.organizationId),
        ),
      ),
    (e) => Err.from(e, { cause: e }),
  );
};
