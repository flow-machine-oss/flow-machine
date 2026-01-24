import { ResultAsync, ok } from "neverthrow";
import { daytonaClient } from "@/old/client/daytona.client";
import type { Ctx } from "@/old/lib/ctx";
import { Err } from "@/old/lib/err";
import type { WithOrganizationId } from "@/old/lib/type";

type Payload = WithOrganizationId<{ sandboxId: string; sessionId: string }>;

export const deleteSessionActionUseCase = async (
  ctx: Ctx,
  { sandboxId, sessionId, organizationId }: Payload,
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
  await result.value.process.deleteSession(sessionId);

  return ok();
};
