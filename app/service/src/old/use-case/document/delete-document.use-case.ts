import { and, eq } from "drizzle-orm";
import { isNil } from "es-toolkit";
import { ResultAsync, err } from "neverthrow";
import type { Ctx } from "@/old/lib/ctx";
import { Err } from "@/old/lib/err";
import type { WithOrganizationId } from "@/old/lib/type";
import { documentTable } from "@/old/schema/document.schema";

type Payload = WithOrganizationId<{
  id: string;
}>;

export const deleteDocumentUseCase = async (
  ctx: Ctx,
  { id, organizationId }: Payload,
) => {
  const existsResult = await ResultAsync.fromPromise(
    ctx.db.query.document.findFirst({
      where: { id, organizationId },
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
      .delete(documentTable)
      .where(
        and(
          eq(documentTable.id, id),
          eq(documentTable.organizationId, organizationId),
        ),
      ),
    (e) => Err.from(e, { cause: e }),
  );
};
