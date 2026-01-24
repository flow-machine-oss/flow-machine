import { UTCDate } from "@date-fns/utc";
import { and, eq } from "drizzle-orm";
import { isNil } from "es-toolkit";
import { ResultAsync, err } from "neverthrow";
import type z from "zod";
import type { updateIntegrationBasicCredentialRequestBodySchema } from "@/old/dto/integration-basic-credential/update-integration-basic-credential.dto";
import type { Ctx } from "@/old/lib/ctx";
import { Err } from "@/old/lib/err";
import type { WithOrganizationId } from "@/old/lib/type";
import { integrationBasicCredentialTable } from "@/old/schema/integration-basic-credential.schema";

type Payload = WithOrganizationId<{
  id: string;
  body: z.infer<typeof updateIntegrationBasicCredentialRequestBodySchema>;
}>;

export const updateIntegrationBasicCredentialUseCase = async (
  ctx: Ctx,
  { id, body, organizationId }: Payload,
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
      .update(integrationBasicCredentialTable)
      .set({
        ...body,
        updatedAt: new UTCDate(),
      })
      .where(
        and(
          eq(integrationBasicCredentialTable.id, id),
          eq(integrationBasicCredentialTable.organizationId, organizationId),
        ),
      ),
    (e) => Err.from(e, { cause: e }),
  );
};
