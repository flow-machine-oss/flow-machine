import { ResultAsync } from "neverthrow";
import { daytonaClient } from "@/old/client/daytona.client";
import type { Ctx } from "@/old/lib/ctx";
import { Err } from "@/old/lib/err";
import type { WithOrganizationId } from "@/old/lib/type";

type Payload = WithOrganizationId;

export const createSandboxActionUseCase = async (
  ctx: Ctx,
  { organizationId }: Payload,
) => {
  return ResultAsync.fromPromise(
    daytonaClient.create({
      language: "typescript",
      labels: { organizationId },
    }),
    (e) => Err.from(e),
  );
};
