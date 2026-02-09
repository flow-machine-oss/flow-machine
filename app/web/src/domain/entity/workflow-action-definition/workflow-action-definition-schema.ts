import { z } from "zod/v4";
import { baseDomainSchema } from "@/domain/entity/shared-schema";

export const workflowActionDefinitionDomainSchema = z.object({
  ...baseDomainSchema.shape,
  kind: z.string(),
  name: z.string(),
});

export type WorkflowActionDefinitionDomain = z.infer<
  typeof workflowActionDefinitionDomainSchema
>;
