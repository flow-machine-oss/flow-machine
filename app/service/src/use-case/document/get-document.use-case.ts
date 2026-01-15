import { and, eq } from "drizzle-orm";
import { ResultAsync, err, ok } from "neverthrow";
import type z from "zod";
import type { currentUserSchema } from "@/guard/auth-check.guard";
import type { Ctx } from "@/lib/ctx";
import { Err } from "@/lib/err";
import { documentTable } from "@/schema/document.schema";

type Payload = {
  id: string;
  user: z.infer<typeof currentUserSchema>;
};

export const getDocumentUseCase = async (ctx: Ctx, { id, user }: Payload) => {
  return ResultAsync.fromPromise(
    ctx.db
      .select()
      .from(documentTable)
      .where(
        and(
          eq(documentTable.id, id),
          eq(documentTable.organizationId, user.organizationId),
        ),
      )
      .limit(1),
    (e) => Err.from(e),
  ).andThen((results) => {
    if (results.length === 0) {
      return err(Err.code("notFound"));
    }
    return ok(results[0]);
  });
};
