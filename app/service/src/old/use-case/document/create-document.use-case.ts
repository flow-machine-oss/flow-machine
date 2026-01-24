import { UTCDate } from "@date-fns/utc";
import { ResultAsync } from "neverthrow";
import z from "zod";
import { createDocumentRequestBodySchema } from "@/old/dto/document/create-document.dto";
import type { Ctx } from "@/old/lib/ctx";
import { Err } from "@/old/lib/err";
import { newId } from "@/old/lib/id";
import type { WithOrganizationId } from "@/old/lib/type";
import {
  type DocumentSelect,
  documentTable,
} from "@/old/schema/document.schema";

type Payload = WithOrganizationId<{
  body: z.infer<typeof createDocumentRequestBodySchema>;
}>;

export const createDocumentUseCase = async (
  ctx: Ctx,
  { body, organizationId }: Payload,
) => {
  const newDocument = {
    id: newId(),
    createdAt: new UTCDate(),
    updatedAt: new UTCDate(),
    organizationId,

    content: body.content,
    projectId: body.projectId,
    title: body.title,
  } as const satisfies DocumentSelect;

  return ResultAsync.fromPromise(
    ctx.db.insert(documentTable).values(newDocument),
    (e) => Err.from(e, { cause: e }),
  );
};
