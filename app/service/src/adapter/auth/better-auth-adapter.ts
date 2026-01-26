import { UTCDate } from "@date-fns/utc";
import { err, ok } from "neverthrow";
import type { BetterAuthInstance } from "@/adapter/auth/better-auth";
import { Err } from "@/common/err/err";
import type {
  GetActiveMember,
  GetSession,
} from "@/domain/port/auth/auth-service";

type Input = {
  betterAuth: BetterAuthInstance;
};

export const makeGetSession =
  ({ betterAuth }: Input): GetSession =>
  async ({ headers }) => {
    try {
      const result = await betterAuth.api.getSession({ headers });

      if (!result) {
        return ok(null);
      }

      return ok({
        session: {
          id: result.session.id,
          userId: result.session.userId,
          activeOrganizationId: result.session.activeOrganizationId ?? null,
          expiresAt: new UTCDate(result.session.expiresAt),
        },
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name ?? null,
          emailVerified: result.user.emailVerified,
          createdAt: new UTCDate(result.user.createdAt),
          updatedAt: new UTCDate(result.user.updatedAt),
        },
      });
    } catch (error) {
      return err(Err.from(error));
    }
  };

export const makeGetActiveMember =
  ({ betterAuth }: Input): GetActiveMember =>
  async ({ headers }) => {
    try {
      const member = await betterAuth.api.getActiveMember({ headers });

      if (!member) {
        return ok(null);
      }

      return ok({
        id: member.id,
        role: member.role,
        organizationId: member.organizationId,
        userId: member.userId,
        createdAt: new Date(member.createdAt),
      });
    } catch (error) {
      return err(Err.from(error));
    }
  };
