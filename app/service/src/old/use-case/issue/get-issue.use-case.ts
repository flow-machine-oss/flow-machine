import { isNil } from "es-toolkit";
import { ResultAsync, err, ok } from "neverthrow";
import type { Ctx } from "@/old/lib/ctx";
import { Err } from "@/old/lib/err";
import type { WithOrganizationId } from "@/old/lib/type";

type Payload = WithOrganizationId<{
  id: string;
}>;

export const getIssueUseCase = async (
  ctx: Ctx,
  { id, organizationId }: Payload,
) => {
  return ResultAsync.fromPromise(
    ctx.db.query.issue.findFirst({
      where: { id, organizationId },
      with: {
        fieldInstances: {
          with: { integration: true },
        },
        integration: true,
      },
    }),
    (e) => Err.from(e, { cause: e }),
  ).andThen((result) => {
    if (isNil(result)) {
      return err(Err.code("notFound"));
    }
    return ok(result);
  });
};
