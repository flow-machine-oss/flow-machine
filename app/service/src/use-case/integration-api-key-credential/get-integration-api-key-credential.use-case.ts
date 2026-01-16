import { isNil } from "es-toolkit";
import { ResultAsync, err, ok } from "neverthrow";
import type z from "zod";
import type { currentUserSchema } from "@/guard/auth-check.guard";
import type { Ctx } from "@/lib/ctx";
import { Err } from "@/lib/err";

type Payload = {
  id: string;
  user: z.infer<typeof currentUserSchema>;
};

export const getIntegrationApiKeyCredentialUseCase = async (
  ctx: Ctx,
  { id, user }: Payload,
) => {
  return ResultAsync.fromPromise(
    ctx.db.query.integrationApiKeyCredential.findFirst({
      where: { id, organizationId: user.organizationId },
    }),
    (e) => Err.from(e),
  ).andThen((result) => {
    if (isNil(result)) {
      return err(Err.code("notFound"));
    }
    return ok(result);
  });
};
