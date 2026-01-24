import { ResultAsync, ok } from "neverthrow";
import { daytonaClient } from "@/old/client/daytona.client";
import type { Ctx } from "@/old/lib/ctx";
import { Err } from "@/old/lib/err";
import { newId } from "@/old/lib/id";
import type { WithOrganizationId } from "@/old/lib/type";

type Payload = WithOrganizationId<{ sandboxId: string }>;

export const startSessionActionUseCase = async (
  ctx: Ctx,
  { sandboxId, organizationId }: Payload,
) => {
  const result = await ResultAsync.fromPromise(
    daytonaClient.findOne({
      idOrName: sandboxId,
      labels: { organizationId },
    }),
    (e) => Err.from(e),
  );

  if (result.isErr()) {
    return result;
  }
  const sessionId = newId();
  await result.value.process.createSession(sessionId);

  return ok({ sessionId });
};
