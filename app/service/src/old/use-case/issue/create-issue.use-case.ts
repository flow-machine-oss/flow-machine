import { UTCDate } from "@date-fns/utc";
import { isNil } from "es-toolkit";
import { ResultAsync, err } from "neverthrow";
import type z from "zod";
import type { createIssueRequestBodySchema } from "@/old/dto/issue/create-issue.dto";
import type { Ctx } from "@/old/lib/ctx";
import { Err } from "@/old/lib/err";
import { newId } from "@/old/lib/id";
import type { WithOrganizationId } from "@/old/lib/type";
import { issueTable } from "@/old/schema/issue.schema";

type Payload = WithOrganizationId<{
  body: z.infer<typeof createIssueRequestBodySchema>;
}>;

export const createIssueUseCase = async (
  ctx: Ctx,
  { body, organizationId }: Payload,
) => {
  if (body.projectId) {
    const projectCheck = await ResultAsync.fromPromise(
      ctx.db.query.project.findFirst({
        where: { id: body.projectId, organizationId },
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
    organizationId,
    projectId: body.projectId ?? null,
  } as const;

  return ResultAsync.fromPromise(
    ctx.db.insert(issueTable).values(newIssue),
    (e) => Err.from(e, { cause: e }),
  );
};
