import { desc, eq } from "drizzle-orm";
import { ResultAsync } from "neverthrow";
import type z from "zod";
import type { currentUserSchema } from "@/guard/auth-check.guard";
import type { Ctx } from "@/lib/ctx";
import { Err } from "@/lib/err";
import { documentTable } from "@/schema/document.schema";

type Payload = {
  user: z.infer<typeof currentUserSchema>;
};

export const listDocumentsUseCase = async (ctx: Ctx, { user }: Payload) => {
  return ResultAsync.fromPromise(
    ctx.db
      .select()
      .from(documentTable)
      .where(eq(documentTable.organizationId, user.organizationId))
      .orderBy(desc(documentTable.createdAt)),
    (e) => Err.from(e),
  );
};
