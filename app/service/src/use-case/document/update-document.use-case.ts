import { UTCDate } from "@date-fns/utc";
import { and, eq } from "drizzle-orm";
import { ResultAsync, err } from "neverthrow";
import type z from "zod";
import type { currentUserSchema } from "@/guard/auth-check.guard";
import type { Ctx } from "@/lib/ctx";
import { Err } from "@/lib/err";
import { documentTable } from "@/schema/document.schema";

type Payload = {
  id: string;
  body: {
    title?: string;
    content?: string;
    projectId?: string | null;
  };
  user: z.infer<typeof currentUserSchema>;
};

export const updateDocumentUseCase = async (
  ctx: Ctx,
  { id, body, user }: Payload,
) => {
  const existsResult = await ResultAsync.fromPromise(
    ctx.db
      .select({ id: documentTable.id })
      .from(documentTable)
      .where(
        and(
          eq(documentTable.id, id),
          eq(documentTable.organizationId, user.organizationId),
        ),
      )
      .limit(1),
    (e) => Err.from(e),
  );

  if (existsResult.isErr()) {
    return existsResult;
  }

  if (existsResult.value.length === 0) {
    return err(Err.code("notFound"));
  }

  return ResultAsync.fromPromise(
    ctx.db
      .update(documentTable)
      .set({
        ...body,
        updatedAt: new UTCDate(),
      })
      .where(
        and(
          eq(documentTable.id, id),
          eq(documentTable.organizationId, user.organizationId),
        ),
      ),
    (e) => Err.from(e),
  );
};
