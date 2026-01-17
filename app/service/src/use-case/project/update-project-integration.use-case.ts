import { UTCDate } from "@date-fns/utc";
import { and, eq } from "drizzle-orm";
import { isNil } from "es-toolkit";
import { ResultAsync, err } from "neverthrow";
import type z from "zod";
import type { updateProjectIntegrationRequestBodySchema } from "@/dto/project/update-project-integration.dto";
import type { currentUserSchema } from "@/guard/auth-check.guard";
import type { Ctx } from "@/lib/ctx";
import { Err } from "@/lib/err";
import { projectIntegrationTable } from "@/schema/project-integration.schema";

type Payload = {
  projectId: string;
  projectIntegrationId: string;
  body: z.infer<typeof updateProjectIntegrationRequestBodySchema>;
  user: z.infer<typeof currentUserSchema>;
};

export const updateProjectIntegrationUseCase = async (
  ctx: Ctx,
  { projectId, projectIntegrationId, body, user }: Payload,
) => {
  const existsResult = await ResultAsync.fromPromise(
    ctx.db.query.projectIntegration.findFirst({
      where: {
        id: projectIntegrationId,
        projectId,
        organizationId: user.organizationId,
      },
    }),
    (e) => Err.from(e, { cause: e }),
  );

  if (existsResult.isErr()) {
    return existsResult;
  }

  if (isNil(existsResult.value)) {
    return err(Err.code("notFound"));
  }

  if (body.credentialId) {
    const credentialCheck = await ResultAsync.fromPromise(
      ctx.db.query.integrationApiKeyCredential.findFirst({
        where: { id: body.credentialId, organizationId: user.organizationId },
      }),
      (e) => Err.from(e, { cause: e }),
    );

    if (credentialCheck.isErr()) {
      return credentialCheck;
    }

    if (isNil(credentialCheck.value)) {
      return err(Err.code("notFound", { message: "Credential not found" }));
    }
  }

  return ResultAsync.fromPromise(
    ctx.db
      .update(projectIntegrationTable)
      .set({
        ...body,
        updatedAt: new UTCDate(),
      })
      .where(
        and(
          eq(projectIntegrationTable.id, projectIntegrationId),
          eq(projectIntegrationTable.projectId, projectId),
          eq(projectIntegrationTable.organizationId, user.organizationId),
        ),
      ),
    (e) => Err.from(e, { cause: e }),
  );
};
