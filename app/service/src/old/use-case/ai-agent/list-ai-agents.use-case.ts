import { ResultAsync } from "neverthrow";
import type { Ctx } from "@/old/lib/ctx";
import { Err } from "@/old/lib/err";
import type { WithOrganizationId } from "@/old/lib/type";

type Payload = WithOrganizationId;

export const listAiAgentsUseCase = async (
  ctx: Ctx,
  { organizationId }: Payload,
) => {
  return ResultAsync.fromPromise(
    ctx.db.query.aiAgent.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
    }),
    (e) => Err.from(e, { cause: e }),
  );
};
