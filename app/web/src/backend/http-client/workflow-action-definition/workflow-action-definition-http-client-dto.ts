import { z } from "zod/v4";
import { baseHttpClientResponseDtoSchema } from "@/backend/http-client/shared-http-client-schema";

export const workflowActionDefinitionHttpResponseDtoSchema = z.object({
  ...baseHttpClientResponseDtoSchema.shape,
  kind: z.string(),
  name: z.string(),
});
export type WorkflowActionDefinitionHttpResponseDto = z.output<
  typeof workflowActionDefinitionHttpResponseDtoSchema
>;
