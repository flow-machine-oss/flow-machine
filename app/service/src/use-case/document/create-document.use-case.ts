import { UTCDate } from "@date-fns/utc";
import { ResultAsync } from "neverthrow";
import z from "zod";
import { createDocumentRequestBodySchema } from "@/dto/document/create-document.dto";
import { currentUserSchema } from "@/guard/auth-check.guard";
import type { Ctx } from "@/lib/ctx";
import { Err } from "@/lib/err";
import { newId } from "@/lib/id";
import { type DocumentSelect, documentTable } from "@/schema/document.schema";

type Payload = {
  body: z.infer<typeof createDocumentRequestBodySchema>;
  user: z.infer<typeof currentUserSchema>;
};

export const createDocumentUseCase = async (
  ctx: Ctx,
  { body, user }: Payload,
) => {
  const newDocument = {
    id: newId(),
    createdAt: new UTCDate(),
    updatedAt: new UTCDate(),
    organizationId: user.organizationId,

    content: body.content,
    projectId: body.projectId,
    title: body.title,
  } as const satisfies DocumentSelect;

  return ResultAsync.fromPromise(
    ctx.db.insert(documentTable).values(newDocument),
    (e) => Err.from(e, { cause: e }),
  );
};
