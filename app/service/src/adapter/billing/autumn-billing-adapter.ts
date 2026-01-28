import { Autumn, type AutumnError } from "autumn-js";
import { err, ok } from "neverthrow";
import { config } from "@/common/config/config";
import { Err } from "@/common/err/err";
import {
  type AttachProduct,
  type Balance,
  type CancelProduct,
  type CheckFeatureAccess,
  type GetBillingPortal,
  type GetEntitlements,
  type TrackUsage,
  attachProductSchema,
  cancelProductSchema,
  checkFeatureAccessSchema,
  getBillingPortalSchema,
  getEntitlementsSchema,
  trackUsageSchema,
} from "@/domain/port/billing/billing-service";

const autumn = new Autumn({
  secretKey: config.billing.autumnSecretKey,
});

const mapAutumnError = (error: AutumnError): Err => {
  const message = error.message;
  switch (error.code) {
    case "unauthorized":
      return Err.code("unauthorized", { message });
    case "forbidden":
      return Err.code("forbidden", { message });
    case "not_found":
      return Err.code("notFound", { message });
    case "bad_request":
      return Err.code("badRequest", { message });
    default:
      return Err.from(error, { message });
  }
};

type AutumnBalanceResponse = {
  unlimited?: boolean;
  interval?: string;
  balance?: number | null;
  usage?: number;
  included_usage?: number;
  next_reset_at?: number | null;
  overage_allowed?: boolean;
  usage_limit?: number;
};

const mapBalance = (
  featureId: string,
  balance: AutumnBalanceResponse | null | undefined,
): Balance | null => {
  if (!balance) return null;
  return {
    featureId,
    unlimited: balance.unlimited ?? false,
    grantedBalance: balance.included_usage ?? 0,
    purchasedBalance: 0, // SDK doesn't expose this separately
    currentBalance: balance.balance ?? 0,
    usage: balance.usage ?? 0,
    overageAllowed: balance.overage_allowed ?? false,
    maxPurchase: balance.usage_limit ?? null,
    reset: balance.next_reset_at
      ? {
          interval: balance.interval ?? "month",
          intervalCount: 1,
          resetsAt: balance.next_reset_at,
        }
      : null,
    planId: null, // SDK doesn't expose this
  };
};

export const makeCheckFeatureAccess = (): CheckFeatureAccess =>
  checkFeatureAccessSchema.implementAsync(
    async ({ customerId, featureId, requiredBalance, withPreview, sendEvent }) => {
      const { data, error } = await autumn.check({
        customer_id: customerId,
        feature_id: featureId,
        required_balance: requiredBalance,
        with_preview: withPreview,
        send_event: sendEvent,
      });

      if (error) {
        return err(mapAutumnError(error));
      }

      return ok({
        allowed: data.allowed,
        customerId: data.customer_id,
        entityId: data.entity_id ?? null,
        requiredBalance: data.required_balance,
        balance: mapBalance(featureId, {
          unlimited: data.unlimited,
          interval: data.interval,
          balance: data.balance,
          usage: data.usage,
          included_usage: data.included_usage,
          next_reset_at: data.next_reset_at,
          overage_allowed: data.overage_allowed,
          usage_limit: data.usage_limit,
        }),
      });
    },
  );

export const makeTrackUsage = (): TrackUsage =>
  trackUsageSchema.implementAsync(
    async ({ customerId, featureId, value, idempotencyKey, entityId }) => {
      const { data, error } = await autumn.track({
        customer_id: customerId,
        feature_id: featureId,
        value,
        idempotency_key: idempotencyKey,
        entity_id: entityId,
      });

      if (error) {
        return err(mapAutumnError(error));
      }

      return ok({
        customerId: data.customer_id,
        entityId: null, // SDK track response doesn't include entity_id
        eventName: data.event_name ?? data.feature_id ?? featureId,
        value,
        balance: null, // SDK track response doesn't include balance details
      });
    },
  );

export const makeAttachProduct = (): AttachProduct =>
  attachProductSchema.implementAsync(
    async ({ customerId, productId, customerData, options, successUrl }) => {
      const { data, error } = await autumn.attach({
        customer_id: customerId,
        product_id: productId,
        customer_data: customerData,
        options: options?.map((opt) => ({
          feature_id: opt.featureId,
          quantity: opt.quantity,
        })),
        success_url: successUrl,
      });

      if (error) {
        return err(mapAutumnError(error));
      }

      return ok({
        success: true,
        customerId: data.customer_id,
        productIds: data.product_ids ?? [],
        code: data.code,
        message: data.message,
        checkoutUrl: data.checkout_url ?? null,
      });
    },
  );

export const makeCancelProduct = (): CancelProduct =>
  cancelProductSchema.implementAsync(
    async ({ customerId, productId, cancelImmediately, entityId }) => {
      const { data, error } = await autumn.cancel({
        customer_id: customerId,
        product_id: productId,
        cancel_immediately: cancelImmediately,
        entity_id: entityId,
      });

      if (error) {
        return err(mapAutumnError(error));
      }

      return ok({
        message: data.success
          ? "Product cancelled successfully"
          : "Product cancellation failed",
      });
    },
  );

export const makeGetBillingPortal = (): GetBillingPortal =>
  getBillingPortalSchema.implementAsync(async ({ customerId }) => {
    const { data, error } = await autumn.customers.billingPortal(customerId);

    if (error) {
      return err(mapAutumnError(error));
    }

    return ok({
      url: data.url,
    });
  });

export const makeGetEntitlements = (): GetEntitlements =>
  getEntitlementsSchema.implementAsync(async ({ customerId }) => {
    const { data, error } = await autumn.customers.get(customerId);

    if (error) {
      return err(mapAutumnError(error));
    }

    const entitlements = Object.entries(data.features ?? {}).map(
      ([featureId, feature]) => ({
        featureId,
        balance: mapBalance(featureId, feature as AutumnBalanceResponse)!,
      }),
    );

    return ok({
      customerId: data.id ?? customerId,
      entitlements,
      productIds: (data.products ?? []).map((p: { id: string }) => p.id),
    });
  });
