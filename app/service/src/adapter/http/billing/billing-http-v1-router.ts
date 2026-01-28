import Elysia from "elysia";
import {
  attachProductRequestBodySchema,
  billingScopeQuerySchema,
  cancelProductRequestBodySchema,
  checkFeatureAccessRequestBodySchema,
  trackUsageRequestBodySchema,
} from "@/adapter/http/billing/billing-http-v1-dto";
import { makeHttpAuthGuardPlugin } from "@/common/http/http-auth-guard-plugin";
import { errEnvelope, okEnvelope } from "@/common/http/http-envelope";
import type {
  GetActiveMember,
  GetSession,
} from "@/domain/port/auth/auth-service";
import type {
  AttachProduct,
  CancelProduct,
  CheckFeatureAccess,
  GetBillingPortal,
  GetEntitlements,
  TrackUsage,
} from "@/domain/port/billing/billing-service";

type Input = {
  getSession: GetSession;
  getActiveMember: GetActiveMember;
  checkFeatureAccess: CheckFeatureAccess;
  trackUsage: TrackUsage;
  attachProduct: AttachProduct;
  cancelProduct: CancelProduct;
  getBillingPortal: GetBillingPortal;
  getEntitlements: GetEntitlements;
};

export const makeBillingHttpV1Router = ({
  getSession,
  getActiveMember,
  checkFeatureAccess,
  trackUsage,
  attachProduct,
  cancelProduct,
  getBillingPortal,
  getEntitlements,
}: Input) =>
  new Elysia({ name: "billing.v1" })
    .use(makeHttpAuthGuardPlugin({ getSession, getActiveMember }))
    .group("/api/v1/billing", (r) =>
      r
        .post(
          "/check",
          async ({ body, query, organizationId, user }) => {
            const customerId =
              query.scope === "user" ? user.id : organizationId;

            const result = await checkFeatureAccess({
              customerId,
              featureId: body.featureId,
              requiredBalance: body.requiredBalance,
              withPreview: body.withPreview,
              sendEvent: body.sendEvent,
            });

            if (result.isErr()) {
              return errEnvelope(result.error);
            }

            return okEnvelope({ data: result.value });
          },
          {
            body: checkFeatureAccessRequestBodySchema,
            query: billingScopeQuerySchema,
          },
        )
        .post(
          "/track",
          async ({ body, query, organizationId, user }) => {
            const customerId =
              query.scope === "user" ? user.id : organizationId;

            const result = await trackUsage({
              customerId,
              featureId: body.featureId,
              value: body.value,
              idempotencyKey: body.idempotencyKey,
              entityId: body.entityId,
              overageBehavior: body.overageBehavior,
            });

            if (result.isErr()) {
              return errEnvelope(result.error);
            }

            return okEnvelope({ data: result.value });
          },
          {
            body: trackUsageRequestBodySchema,
            query: billingScopeQuerySchema,
          },
        )
        .post(
          "/attach",
          async ({ body, query, organizationId, user }) => {
            const customerId =
              query.scope === "user" ? user.id : organizationId;

            const result = await attachProduct({
              customerId,
              productId: body.productId,
              customerData: body.customerData,
              options: body.options,
              invoiceImmediately: body.invoiceImmediately,
              successUrl: body.successUrl,
            });

            if (result.isErr()) {
              return errEnvelope(result.error);
            }

            return okEnvelope({ data: result.value });
          },
          {
            body: attachProductRequestBodySchema,
            query: billingScopeQuerySchema,
          },
        )
        .post(
          "/cancel",
          async ({ body, query, organizationId, user }) => {
            const customerId =
              query.scope === "user" ? user.id : organizationId;

            const result = await cancelProduct({
              customerId,
              productId: body.productId,
              cancelImmediately: body.cancelImmediately,
              entityId: body.entityId,
            });

            if (result.isErr()) {
              return errEnvelope(result.error);
            }

            return okEnvelope({ data: result.value });
          },
          {
            body: cancelProductRequestBodySchema,
            query: billingScopeQuerySchema,
          },
        )
        .get(
          "/entitlements",
          async ({ query, organizationId, user }) => {
            const customerId =
              query.scope === "user" ? user.id : organizationId;

            const result = await getEntitlements({ customerId });

            if (result.isErr()) {
              return errEnvelope(result.error);
            }

            return okEnvelope({ data: result.value });
          },
          {
            query: billingScopeQuerySchema,
          },
        )
        .get(
          "/portal",
          async ({ query, organizationId, user }) => {
            const customerId =
              query.scope === "user" ? user.id : organizationId;

            const result = await getBillingPortal({ customerId });

            if (result.isErr()) {
              return errEnvelope(result.error);
            }

            return okEnvelope({ data: result.value });
          },
          {
            query: billingScopeQuerySchema,
          },
        ),
    );
