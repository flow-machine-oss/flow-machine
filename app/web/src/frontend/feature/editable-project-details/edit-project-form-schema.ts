import { z } from "zod/v4";
import { projectDomainSchema } from "@/domain/entity/project/project-domain-schema";

export const editProjectFormValuesSchema = z.object({
  name: projectDomainSchema.shape.name,
});

export type EditProjectFormValues = z.infer<typeof editProjectFormValuesSchema>;
