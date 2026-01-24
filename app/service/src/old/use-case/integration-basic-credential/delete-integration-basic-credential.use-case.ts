import { and, eq } from "drizzle-orm";
import { isNil } from "es-toolkit";
import { ResultAsync, err } from "neverthrow";
import type { Ctx } from "@/old/lib/ctx";
import { Err } from "@/old/lib/err";
import type { WithOrganizationId } from "@/old/lib/type";
import { integrationBasicCredentialTable } from "@/old/schema/integration-basic-credential.schema";

type Payload = WithOrganizationId<{
  id: string;
}>;

export const deleteIntegrationBasicCredentialUseCase = async (
  ctx: Ctx,
  { id, organizationId }: Payload,
) => {
  const existsResult = await ResultAsync.fromPromise(
    ctx.db.query.integrationBasicCredential.findFirst({
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
      .delete(integrationBasicCredentialTable)
      .where(
        and(
          eq(integrationBasicCredentialTable.id, id),
          eq(integrationBasicCredentialTable.organizationId, organizationId),
        ),
      ),
    (e) => Err.from(e, { cause: e }),
  );
};
