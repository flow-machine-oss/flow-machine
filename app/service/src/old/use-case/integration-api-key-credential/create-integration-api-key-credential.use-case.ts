import { UTCDate } from "@date-fns/utc";
import { ResultAsync } from "neverthrow";
import z from "zod";
import { createIntegrationApiKeyCredentialRequestBodySchema } from "@/old/dto/integration-api-key-credential/create-integration-api-key-credential.dto";
import type { Ctx } from "@/old/lib/ctx";
import { Err } from "@/old/lib/err";
import { newId } from "@/old/lib/id";
import type { WithOrganizationId } from "@/old/lib/type";
import {
  type IntegrationApiKeyCredentialSelect,
  integrationApiKeyCredentialTable,
} from "@/old/schema/integration-api-key-credential.schema";

type Payload = WithOrganizationId<{
  body: z.infer<typeof createIntegrationApiKeyCredentialRequestBodySchema>;
}>;

export const createIntegrationApiKeyCredentialUseCase = async (
  ctx: Ctx,
  { body, organizationId }: Payload,
) => {
  const newIntegrationApiKeyCredential = {
    id: newId(),
    createdAt: new UTCDate(),
    updatedAt: new UTCDate(),
    organizationId,

    apiKey: body.apiKey,
    expiredAt: body.expiredAt,
  } as const satisfies IntegrationApiKeyCredentialSelect;

  return ResultAsync.fromPromise(
    ctx.db
      .insert(integrationApiKeyCredentialTable)
      .values(newIntegrationApiKeyCredential),
    (e) => Err.from(e, { cause: e }),
  );
};
