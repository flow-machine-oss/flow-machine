import { and, eq } from "drizzle-orm";
import { isNil } from "es-toolkit";
import { ResultAsync, err } from "neverthrow";
import type z from "zod";
import type { currentUserSchema } from "@/guard/auth-check.guard";
import type { Ctx } from "@/lib/ctx";
import { Err } from "@/lib/err";
import { integrationBasicCredentialTable } from "@/schema/integration-basic-credential.schema";

type Payload = {
  id: string;
  user: z.infer<typeof currentUserSchema>;
};

export const deleteIntegrationBasicCredentialUseCase = async (
  ctx: Ctx,
  { id, user }: Payload,
) => {
  const existsResult = await ResultAsync.fromPromise(
    ctx.db.query.integrationBasicCredential.findFirst({
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
      .delete(integrationBasicCredentialTable)
      .where(
        and(
          eq(integrationBasicCredentialTable.id, id),
          eq(
            integrationBasicCredentialTable.organizationId,
            user.organizationId,
          ),
        ),
      ),
    (e) => Err.from(e),
  );
};
