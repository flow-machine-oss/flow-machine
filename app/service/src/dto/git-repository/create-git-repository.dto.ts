import z from "zod";

export const createGitRepositoryRequestBodySchema = z.object({
  contributorEmail: z.string().email().max(256),
  contributorName: z.string().min(1).max(256),
  name: z.string().min(1).max(256),
  url: z
    .string()
    .url()
    .max(256)
    .regex(/^https:\/\//, "URL must use HTTPS protocol"),
});
