import { UTCDate } from "@date-fns/utc";
import { ResultAsync } from "neverthrow";
import type z from "zod";
import type { createProjectRequestBodySchema } from "@/old/dto/project/create-project.dto";
import type { Ctx } from "@/old/lib/ctx";
import { Err } from "@/old/lib/err";
import { newId } from "@/old/lib/id";
import type { WithOrganizationId } from "@/old/lib/type";
import { type ProjectSelect, projectTable } from "@/old/schema/project.schema";

type Payload = WithOrganizationId<{
  body: z.infer<typeof createProjectRequestBodySchema>;
}>;

export const createProjectUseCase = async (
  ctx: Ctx,
  { body, organizationId }: Payload,
) => {
  const newProject = {
    id: newId(),
    createdAt: new UTCDate(),
    updatedAt: new UTCDate(),
    organizationId,

    name: body.name,
    key: body.key,
  } as const satisfies ProjectSelect;

  return ResultAsync.fromPromise(
    ctx.db.insert(projectTable).values(newProject),
    (e) => Err.from(e, { cause: e }),
  );
};
