import z from "zod";
import { idSchema } from "@/lib/id";

export const gitRepositoryIntegrationParamsSchema = z.object({
  id: idSchema,
  integrationId: idSchema,
});
