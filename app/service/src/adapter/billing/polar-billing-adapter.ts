import { Polar } from "@polar-sh/sdk";
import { attemptAsync, isNotNil } from "es-toolkit";
import { err, ok } from "neverthrow";
import { config } from "@/common/config/config";
import { Err } from "@/common/err/err";
import type {
  CancelSubscription,
  CreateCheckoutSession,
  GetUserSubscription,
} from "@/domain/port/billing/billing-service";

const polar = new Polar({
  accessToken: config.billing.polarAccessToken,
  server: config.billing.polarEnvironment,
});

export const makeCreateCheckoutSession =
  (): CreateCheckoutSession =>
  async ({ userId, productId, successUrl }) => {
    const [error, result] = await attemptAsync(() =>
      polar.checkouts.create({
        products: [productId],
        successUrl,
        metadata: { userId },
      }),
    );

    if (isNotNil(error) || !result) {
      return err(Err.from(error ?? new Error("No checkout session created")));
    }

    return ok({
      id: result.id,
      url: result.url,
      customerId: result.customerId ?? userId,
      status: result.status as "open" | "expired" | "completed",
    });
  };

export const makeGetUserSubscription =
  (): GetUserSubscription =>
  async ({ userId }) => {
    const [error, subscriptions] = await attemptAsync(async () => {
      const iterator = await polar.subscriptions.list({
        customerId: userId,
        active: true,
      });

      const items: Awaited<typeof iterator>["result"]["items"] = [];
      for await (const page of iterator) {
        items.push(...page.result.items);
      }
      return items;
    });

    if (isNotNil(error)) {
      return err(Err.from(error));
    }

    const subscription = subscriptions?.[0];

    if (!subscription) {
      return ok(null);
    }

    return ok({
      id: subscription.id,
      userId: subscription.customerId,
      status: subscription.status as
        | "active"
        | "canceled"
        | "incomplete"
        | "past_due",
      currentPeriodEnd: subscription.currentPeriodEnd
        ? new Date(subscription.currentPeriodEnd)
        : null,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd ?? false,
    });
  };

export const makeCancelSubscription =
  (): CancelSubscription =>
  async ({ subscriptionId, immediate }) => {
    if (immediate) {
      const [error] = await attemptAsync(() =>
        polar.subscriptions.revoke({
          id: subscriptionId,
        }),
      );

      if (isNotNil(error)) {
        return err(Err.from(error));
      }
    } else {
      const [error] = await attemptAsync(() =>
        polar.subscriptions.update({
          id: subscriptionId,
          subscriptionUpdate: {
            cancelAtPeriodEnd: true,
          },
        }),
      );

      if (isNotNil(error)) {
        return err(Err.from(error));
      }
    }

    return ok(undefined);
  };
