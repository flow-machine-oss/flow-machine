import z from "zod";

export const updateGitRepositoryRequestBodySchema = z.object({
  contributorEmail: z.email().max(256).optional(),
  contributorName: z.string().min(1).max(256).optional(),
  name: z.string().min(1).max(256).optional(),
  url: z
    .url()
    .max(256)
    .regex(/^https:\/\//, "URL must use HTTPS protocol")
    .optional(),
});
