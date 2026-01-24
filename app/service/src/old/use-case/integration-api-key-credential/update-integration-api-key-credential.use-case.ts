import { UTCDate } from "@date-fns/utc";
import { and, eq } from "drizzle-orm";
import { isNil } from "es-toolkit";
import { ResultAsync, err } from "neverthrow";
import type z from "zod";
import { updateIntegrationApiKeyCredentialRequestBodySchema } from "@/old/dto/integration-api-key-credential/update-integration-api-key-credential.dto";
import type { Ctx } from "@/old/lib/ctx";
import { Err } from "@/old/lib/err";
import type { WithOrganizationId } from "@/old/lib/type";
import { integrationApiKeyCredentialTable } from "@/old/schema/integration-api-key-credential.schema";

type Payload = WithOrganizationId<{
  id: string;
  body: z.infer<typeof updateIntegrationApiKeyCredentialRequestBodySchema>;
}>;

export const updateIntegrationApiKeyCredentialUseCase = async (
  ctx: Ctx,
  { id, body, organizationId }: Payload,
) => {
  const existsResult = await ResultAsync.fromPromise(
    ctx.db.query.integrationApiKeyCredential.findFirst({
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
      .update(integrationApiKeyCredentialTable)
      .set({
        ...body,
        updatedAt: new UTCDate(),
      })
      .where(
        and(
          eq(integrationApiKeyCredentialTable.id, id),
          eq(integrationApiKeyCredentialTable.organizationId, organizationId),
        ),
      ),
    (e) => Err.from(e, { cause: e }),
  );
};
