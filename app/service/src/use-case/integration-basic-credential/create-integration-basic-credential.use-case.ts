import { UTCDate } from "@date-fns/utc";
import { ResultAsync } from "neverthrow";
import type z from "zod";
import type { createIntegrationBasicCredentialRequestBodySchema } from "@/dto/integration-basic-credential/create-integration-basic-credential.dto";
import type { currentUserSchema } from "@/guard/auth-check.guard";
import type { Ctx } from "@/lib/ctx";
import { Err } from "@/lib/err";
import { newId } from "@/lib/id";
import { integrationBasicCredentialTable } from "@/schema/integration-basic-credential.schema";

type Payload = {
  body: z.infer<typeof createIntegrationBasicCredentialRequestBodySchema>;
  user: z.infer<typeof currentUserSchema>;
};

export const createIntegrationBasicCredentialUseCase = async (
  ctx: Ctx,
  { body, user }: Payload,
) => {
  const newCredential = {
    id: newId(),
    createdAt: new UTCDate(),
    updatedAt: new UTCDate(),
    organizationId: user.organizationId,

    username: body.username,
    password: body.password,
    expiredAt: body.expiredAt,
  } as const;

  return ResultAsync.fromPromise(
    ctx.db.insert(integrationBasicCredentialTable).values(newCredential),
    (e) => Err.from(e),
  );
};
