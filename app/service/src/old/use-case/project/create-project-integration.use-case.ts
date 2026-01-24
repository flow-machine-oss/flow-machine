import { UTCDate } from "@date-fns/utc";
import { isNil } from "es-toolkit";
import { ResultAsync, err } from "neverthrow";
import type z from "zod";
import type { createProjectIntegrationRequestBodySchema } from "@/old/dto/project/create-project-integration.dto";
import type { Ctx } from "@/old/lib/ctx";
import { Err } from "@/old/lib/err";
import { newId } from "@/old/lib/id";
import type { WithOrganizationId } from "@/old/lib/type";
import { projectIntegrationTable } from "@/old/schema/project-integration.schema";

type Payload = WithOrganizationId<{
  projectId: string;
  body: z.infer<typeof createProjectIntegrationRequestBodySchema>;
}>;

export const createProjectIntegrationUseCase = async (
  ctx: Ctx,
  { projectId, body, organizationId }: Payload,
) => {
  const projectCheck = await ResultAsync.fromPromise(
    ctx.db.query.project.findFirst({
      where: { id: projectId, organizationId: organizationId },
      with: { integration: true },
    }),
    (e) => Err.from(e, { cause: e }),
  );

  if (projectCheck.isErr()) {
    return projectCheck;
  }

  if (isNil(projectCheck.value)) {
    return err(Err.code("notFound", { message: "Project not found" }));
  }

  if (!isNil(projectCheck.value.integration)) {
    return err(
      Err.code("conflict", {
        message: "Project already has an integration",
      }),
    );
  }

  const credentialCheck = await ResultAsync.fromPromise(
    ctx.db.query.integrationApiKeyCredential.findFirst({
      where: { id: body.credentialId, organizationId: organizationId },
    }),
    (e) => Err.from(e, { cause: e }),
  );

  if (credentialCheck.isErr()) {
    return credentialCheck;
  }

  if (isNil(credentialCheck.value)) {
    return err(Err.code("notFound", { message: "Credential not found" }));
  }

  const newIntegration = {
    id: newId(),
    createdAt: new UTCDate(),
    updatedAt: new UTCDate(),
    organizationId: organizationId,

    credentialId: body.credentialId,
    externalId: body.externalId,
    projectId,
    providerId: body.providerId,
    webhookSecret: body.webhookSecret,
  } as const;

  return ResultAsync.fromPromise(
    ctx.db.insert(projectIntegrationTable).values(newIntegration),
    (e) => Err.from(e, { cause: e }),
  );
};
