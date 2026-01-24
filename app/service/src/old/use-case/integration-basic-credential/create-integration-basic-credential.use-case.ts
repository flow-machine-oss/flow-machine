import { UTCDate } from "@date-fns/utc";
import { ResultAsync } from "neverthrow";
import type z from "zod";
import type { createIntegrationBasicCredentialRequestBodySchema } from "@/old/dto/integration-basic-credential/create-integration-basic-credential.dto";
import type { Ctx } from "@/old/lib/ctx";
import { Err } from "@/old/lib/err";
import { newId } from "@/old/lib/id";
import type { WithOrganizationId } from "@/old/lib/type";
import { integrationBasicCredentialTable } from "@/old/schema/integration-basic-credential.schema";

type Payload = WithOrganizationId<{
  body: z.infer<typeof createIntegrationBasicCredentialRequestBodySchema>;
}>;

export const createIntegrationBasicCredentialUseCase = async (
  ctx: Ctx,
  { body, organizationId }: Payload,
) => {
  const newCredential = {
    id: newId(),
    createdAt: new UTCDate(),
    updatedAt: new UTCDate(),
    organizationId,

    username: body.username,
    password: body.password,
    expiredAt: body.expiredAt,
  } as const;

  return ResultAsync.fromPromise(
    ctx.db.insert(integrationBasicCredentialTable).values(newCredential),
    (e) => Err.from(e, { cause: e }),
  );
};
