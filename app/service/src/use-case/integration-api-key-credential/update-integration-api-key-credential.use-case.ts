import { UTCDate } from "@date-fns/utc";
import { and, eq } from "drizzle-orm";
import { isNil } from "es-toolkit";
import { ResultAsync, err } from "neverthrow";
import type z from "zod";
import type { updateIntegrationApiKeyCredentialRequestBodySchema } from "@/dto/integration-api-key-credential/update-integration-api-key-credential.dto";
import type { currentUserSchema } from "@/guard/auth-check.guard";
import type { Ctx } from "@/lib/ctx";
import { Err } from "@/lib/err";
import { integrationApiKeyCredentialTable } from "@/schema/integration-api-key-credential.schema";

type Payload = {
  id: string;
  body: z.infer<typeof updateIntegrationApiKeyCredentialRequestBodySchema>;
  user: z.infer<typeof currentUserSchema>;
};

export const updateIntegrationApiKeyCredentialUseCase = async (
  ctx: Ctx,
  { id, body, user }: Payload,
) => {
  const existsResult = await ResultAsync.fromPromise(
    ctx.db.query.integrationApiKeyCredential.findFirst({
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
      .update(integrationApiKeyCredentialTable)
      .set({
        ...body,
        updatedAt: new UTCDate(),
      })
      .where(
        and(
          eq(integrationApiKeyCredentialTable.id, id),
          eq(
            integrationApiKeyCredentialTable.organizationId,
            user.organizationId,
          ),
        ),
      ),
    (e) => Err.from(e),
  );
};
