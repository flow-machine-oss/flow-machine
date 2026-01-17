import { UTCDate } from "@date-fns/utc";
import { and, eq } from "drizzle-orm";
import { isNil } from "es-toolkit";
import { ResultAsync, err } from "neverthrow";
import type z from "zod";
import type { updateIntegrationBasicCredentialRequestBodySchema } from "@/dto/integration-basic-credential/update-integration-basic-credential.dto";
import type { currentUserSchema } from "@/guard/auth-check.guard";
import type { Ctx } from "@/lib/ctx";
import { Err } from "@/lib/err";
import { integrationBasicCredentialTable } from "@/schema/integration-basic-credential.schema";

type Payload = {
  id: string;
  body: z.infer<typeof updateIntegrationBasicCredentialRequestBodySchema>;
  user: z.infer<typeof currentUserSchema>;
};

export const updateIntegrationBasicCredentialUseCase = async (
  ctx: Ctx,
  { id, body, user }: Payload,
) => {
  const existsResult = await ResultAsync.fromPromise(
    ctx.db.query.integrationBasicCredential.findFirst({
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
      .update(integrationBasicCredentialTable)
      .set({
        ...body,
        updatedAt: new UTCDate(),
      })
      .where(
        and(
          eq(integrationBasicCredentialTable.id, id),
          eq(
            integrationBasicCredentialTable.organizationId,
            user.organizationId,
          ),
        ),
      ),
    (e) => Err.from(e, { cause: e }),
  );
};
