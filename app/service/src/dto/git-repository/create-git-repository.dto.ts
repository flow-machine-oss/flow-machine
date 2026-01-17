import z from "zod";

export const createGitRepositoryRequestBodySchema = z.object({
  contributorEmail: z.email().max(256),
  contributorName: z.string().min(1).max(256),
  name: z.string().min(1).max(256),
  url: z
    .url()
    .max(256)
    .regex(/^https:\/\//, "URL must use HTTPS protocol"),
});
