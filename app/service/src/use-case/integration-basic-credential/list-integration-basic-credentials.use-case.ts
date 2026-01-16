import { ResultAsync } from "neverthrow";
import type z from "zod";
import type { currentUserSchema } from "@/guard/auth-check.guard";
import type { Ctx } from "@/lib/ctx";
import { Err } from "@/lib/err";

type Payload = {
  user: z.infer<typeof currentUserSchema>;
};

export const listIntegrationBasicCredentialsUseCase = async (
  ctx: Ctx,
  { user }: Payload,
) => {
  return ResultAsync.fromPromise(
    ctx.db.query.integrationBasicCredential.findMany({
      where: { organizationId: user.organizationId },
      orderBy: { createdAt: "desc" },
    }),
    (e) => Err.from(e),
  );
};
