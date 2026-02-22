import { z } from "zod/v4";
import { projectDomainSchema } from "@/domain/entity/project/project-domain-schema";

export const newProjectFormValuesSchema = z.object({
  name: projectDomainSchema.shape.name,
});

export type NewProjectFormValues = z.infer<typeof newProjectFormValuesSchema>;
