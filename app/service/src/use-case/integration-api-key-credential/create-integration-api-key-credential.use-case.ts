import { UTCDate } from "@date-fns/utc";
import { ResultAsync } from "neverthrow";
import type z from "zod";
import type { currentUserSchema } from "@/guard/auth-check.guard";
import type { Ctx } from "@/lib/ctx";
import { Err } from "@/lib/err";
import { newId } from "@/lib/id";
import {
  type IntegrationApiKeyCredentialSelect,
  integrationApiKeyCredentialTable,
} from "@/schema/integration-api-key-credential.schema";

type Payload = {
  body: {
    apiKey: string;
    expiredAt: Date;
  };
  user: z.infer<typeof currentUserSchema>;
};

export const createIntegrationApiKeyCredentialUseCase = async (
  ctx: Ctx,
  { body, user }: Payload,
) => {
  const newCredential = {
    id: newId(),
    createdAt: new UTCDate(),
    updatedAt: new UTCDate(),
    organizationId: user.organizationId,

    apiKey: body.apiKey,
    expiredAt: body.expiredAt,
  } as const satisfies IntegrationApiKeyCredentialSelect;

  return ResultAsync.fromPromise(
    ctx.db.insert(integrationApiKeyCredentialTable).values(newCredential),
    (e) => Err.from(e),
  );
};
