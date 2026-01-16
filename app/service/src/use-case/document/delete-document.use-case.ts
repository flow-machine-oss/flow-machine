import { and, eq } from "drizzle-orm";
import { isNil } from "es-toolkit";
import { ResultAsync, err } from "neverthrow";
import type z from "zod";
import type { currentUserSchema } from "@/guard/auth-check.guard";
import type { Ctx } from "@/lib/ctx";
import { Err } from "@/lib/err";
import { documentTable } from "@/schema/document.schema";

type Payload = {
  id: string;
  user: z.infer<typeof currentUserSchema>;
};

export const deleteDocumentUseCase = async (
  ctx: Ctx,
  { id, user }: Payload,
) => {
  const existsResult = await ResultAsync.fromPromise(
    ctx.db.query.document.findFirst({
      where: { id, organizationId: user.organizationId },
    }),
    (e) => Err.from(e),
  );

  if (existsResult.isErr()) {
    return existsResult;
  }

  if (isNil(existsResult.value)) {
    return err(Err.code("notFound"));
  }

  return ResultAsync.fromPromise(
    ctx.db
      .delete(documentTable)
      .where(
        and(
          eq(documentTable.id, id),
          eq(documentTable.organizationId, user.organizationId),
        ),
      ),
    (e) => Err.from(e),
  );
};
