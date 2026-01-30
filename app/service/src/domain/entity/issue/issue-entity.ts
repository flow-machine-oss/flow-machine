import z from "zod";
import { entityIdSchema } from "@/common/domain/entity-id";
import { projectProviders } from "@/domain/entity/provider/project-provider";

export const issueEntityProps = z.object({
  integration: z
    .object({
      provider: z.enum(projectProviders),
      externalId: z.string().min(1).max(32),
    })
    .optional(),

  projectId: entityIdSchema.nullable(),
});
