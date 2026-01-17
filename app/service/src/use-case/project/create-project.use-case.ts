import { UTCDate } from "@date-fns/utc";
import { ResultAsync } from "neverthrow";
import type z from "zod";
import type { createProjectRequestBodySchema } from "@/dto/project/create-project.dto";
import type { currentUserSchema } from "@/guard/auth-check.guard";
import type { Ctx } from "@/lib/ctx";
import { Err } from "@/lib/err";
import { newId } from "@/lib/id";
import { type ProjectSelect, projectTable } from "@/schema/project.schema";

type Payload = {
  body: z.infer<typeof createProjectRequestBodySchema>;
  user: z.infer<typeof currentUserSchema>;
};

export const createProjectUseCase = async (ctx: Ctx, { body, user }: Payload) => {
  const newProject = {
    id: newId(),
    createdAt: new UTCDate(),
    updatedAt: new UTCDate(),
    organizationId: user.organizationId,

    name: body.name,
    key: body.key,
  } as const satisfies ProjectSelect;

  return ResultAsync.fromPromise(
    ctx.db.insert(projectTable).values(newProject),
    (e) => Err.from(e, { cause: e }),
  );
};
