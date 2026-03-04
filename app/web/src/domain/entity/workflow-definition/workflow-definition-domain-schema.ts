import { z } from "zod/v4";
import {
  datetimeSchema,
  domainIdSchema,
  tenantAwareBaseDomainSchema,
} from "@/domain/entity/shared-schema";

const workflowActionSchema = z.object({
  id: z.uuidv7(),
  kind: z.string(),
  name: z.string(),
  inputs: z.record(z.string(), z.unknown()).optional(),
});

const workflowEdgeSchema = z.object({
  from: z.uuidv7(),
  to: z.uuidv7(),
});

export const workflowDefinitionDomainSchema = z.object({
  ...tenantAwareBaseDomainSchema.shape,
  name: z.string(),
  description: z.string().optional(),
  projects: z.array(
    z.object({
      id: domainIdSchema,
      syncStatus: z.enum(["idle", "pending", "success", "error"]),
      syncedAt: datetimeSchema.nullable(),
    }),
  ),
  actions: workflowActionSchema.array(),
  edges: workflowEdgeSchema.array(),
  isActive: z.boolean(),
});
export type WorkflowDefinitionDomain = z.infer<
  typeof workflowDefinitionDomainSchema
>;
