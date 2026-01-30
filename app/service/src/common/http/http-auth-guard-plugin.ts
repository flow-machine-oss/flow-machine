import Elysia from "elysia";
import { isNil } from "es-toolkit";
import z from "zod";
import type { Tenant } from "@/common/domain/tenant-aware-entity";
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

      if (isNil(session.activeOrganizationId)) {
        const tenant = { id: user.id, type: "user" } satisfies Tenant;
        return { organization: null, tenant, user };
      }

      const memberResult = await getActiveMember({
        headers: new Headers(headers as Record<string, string>),
      });

      if (memberResult.isErr()) {
        throw memberResult.error;
      }
      if (isNil(memberResult.value)) {
        throw Err.code("notFound");
      }
      const tenant = {
        id: session.activeOrganizationId,
        type: "organization",
      } satisfies Tenant;

      return {
        organization: {
          id: session.activeOrganizationId,
          role: memberResult.value.role,
        },
        tenant,
        user,
      };
    },
  );
