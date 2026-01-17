import { and, eq } from "drizzle-orm";
import { isNil } from "es-toolkit";
import { ResultAsync, err } from "neverthrow";
import type z from "zod";
import type { currentUserSchema } from "@/guard/auth-check.guard";
import type { Ctx } from "@/lib/ctx";
import { Err } from "@/lib/err";
import { issueTable } from "@/schema/issue.schema";

type Payload = {
  id: string;
  user: z.infer<typeof currentUserSchema>;
};

export const deleteIssueUseCase = async (ctx: Ctx, { id, user }: Payload) => {
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

  return ResultAsync.fromPromise(
    ctx.db
      .delete(issueTable)
      .where(
        and(
          eq(issueTable.id, id),
          eq(issueTable.organizationId, user.organizationId),
        ),
      ),
    (e) => Err.from(e, { cause: e }),
  );
};
