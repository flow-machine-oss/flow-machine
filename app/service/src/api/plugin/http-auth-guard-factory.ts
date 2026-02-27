import Elysia from "elysia";
import { isNil } from "es-toolkit";
import type { Tenant } from "@/core/domain/tenant-aware-entity";
import type { AuthService } from "@/core/feature/auth/service";

class HttpAuthGuardFactory {
  #authService: AuthService;

  constructor(authService: AuthService) {
    this.#authService = authService;
  }

  make() {
    return new Elysia({ name: "authGuard" }).resolve(
      { as: "scoped" },
      async ({ headers }) => {
        const activeSessionResult = await this.#authService.getActiveSession({
          headers: new Headers(headers as Record<string, string>),
        });

        if (activeSessionResult.isErr()) {
          throw activeSessionResult.error;
        }
        const activeSession = activeSessionResult.value;

        if (isNil(activeSession.props.activeOrganizationId)) {
          const tenant = {
            id: activeSession.props.userId,
            type: "user",
          } satisfies Tenant;
          return { tenant } as const;
        }

        const activeMemberResult = await this.#authService.getActiveMember({
          headers: new Headers(headers as Record<string, string>),
        });

        if (activeMemberResult.isErr()) {
          throw activeMemberResult.error;
        }

        const tenant = {
          id: activeSession.props.activeOrganizationId,
          type: "organization",
        } satisfies Tenant;
        return { tenant } as const;
      },
    );
  }
}

export { HttpAuthGuardFactory };
