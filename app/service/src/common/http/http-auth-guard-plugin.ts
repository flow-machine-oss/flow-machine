import Elysia from "elysia";
import z from "zod";
import { Err } from "@/common/err/err";
import type {
  GetActiveMember,
  GetSession,
} from "@/domain/port/auth/auth-service";

export const currentUserSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  organizationId: z.string(),
  organizationRole: z.enum(["org:admin", "org:member"] as const),
});

type Input = {
  getSession: GetSession;
  getActiveMember: GetActiveMember;
};

export const makeHttpAuthGuardPlugin = ({
  getSession,
  getActiveMember,
}: Input) =>
  new Elysia({ name: "authGuard" }).resolve(
    { as: "scoped" },
    async ({ headers }) => {
      const sessionResult = await getSession({
        headers: new Headers(headers as Record<string, string>),
      });

      if (sessionResult.isErr()) {
        throw sessionResult.error;
      }

      if (!sessionResult.value) {
        throw Err.code("unauthorized");
      }

      const { session, user } = sessionResult.value;

      let organizationRole: "org:admin" | "org:member" = "org:member";

      if (session.activeOrganizationId) {
        const memberResult = await getActiveMember({
          headers: new Headers(headers as Record<string, string>),
        });

        if (memberResult.isErr()) {
          throw memberResult.error;
        }

        if (memberResult.value) {
          const { role } = memberResult.value;
          organizationRole =
            role === "owner" || role === "admin" ? "org:admin" : "org:member";
        }
      }

      const nameParts = (user.name ?? "").split(" ");

      return {
        organizationId: session.activeOrganizationId ?? "",
        user: {
          id: user.id,
          email: user.email,
          firstName: nameParts[0] ?? "",
          lastName: nameParts.slice(1).join(" ") ?? "",
          organizationId: session.activeOrganizationId ?? "",
          organizationRole,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };
    },
  );
