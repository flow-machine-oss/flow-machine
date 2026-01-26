import z from "zod";
import { Err } from "@/common/err/err";
import { makeResultSchema } from "@/common/schema/result-schema";

export const sessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  activeOrganizationId: z.string().nullable(),
  expiresAt: z.date(),
});
export type Session = z.output<typeof sessionSchema>;

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  emailVerified: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type User = z.output<typeof userSchema>;

export const sessionWithUserSchema = z.object({
  session: sessionSchema,
  user: userSchema,
});
export type SessionWithUser = z.output<typeof sessionWithUserSchema>;

export const memberSchema = z.object({
  id: z.string(),
  role: z.enum(["owner", "admin", "member"]),
  organizationId: z.string(),
  userId: z.string(),
  createdAt: z.date(),
});
export type Member = z.output<typeof memberSchema>;

export const getSessionSchema = z.function({
  input: [
    z.object({
      headers: z.instanceof(Headers),
    }),
  ],
  output: z.promise(
    makeResultSchema(sessionWithUserSchema.nullable(), z.instanceof(Err)),
  ),
});
export type GetSession = z.output<typeof getSessionSchema>;

export const getActiveMemberSchema = z.function({
  input: [
    z.object({
      headers: z.instanceof(Headers),
    }),
  ],
  output: z.promise(
    makeResultSchema(memberSchema.nullable(), z.instanceof(Err)),
  ),
});
export type GetActiveMember = z.output<typeof getActiveMemberSchema>;
