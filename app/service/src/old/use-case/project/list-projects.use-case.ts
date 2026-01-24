import { ResultAsync } from "neverthrow";
import type { Ctx } from "@/old/lib/ctx";
import { Err } from "@/old/lib/err";
import type { WithOrganizationId } from "@/old/lib/type";

type Payload = WithOrganizationId;

export const listProjectsUseCase = async (
  ctx: Ctx,
  { organizationId }: Payload,
) => {
  return ResultAsync.fromPromise(
    ctx.db.query.project.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      with: { integration: true },
    }),
    (e) => Err.from(e, { cause: e }),
  );
};
