import z from "zod";
import { Err } from "@/common/err/err";
import { makeResultSchema } from "@/common/schema/result-schema";

export const checkoutSessionSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  customerId: z.string(),
  status: z.enum(["open", "expired", "completed"]),
});
export type CheckoutSession = z.output<typeof checkoutSessionSchema>;

export const createCheckoutSessionSchema = z.function({
  input: [
    z.object({
      userId: z.string(),
      productId: z.string(),
      successUrl: z.string().url(),
    }),
  ],
  output: z.promise(
    makeResultSchema(checkoutSessionSchema, z.instanceof(Err)),
  ),
});
export type CreateCheckoutSession = z.output<
  typeof createCheckoutSessionSchema
>;

export const subscriptionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  status: z.enum(["active", "canceled", "incomplete", "past_due"]),
  currentPeriodEnd: z.date().nullable(),
  cancelAtPeriodEnd: z.boolean(),
});
export type Subscription = z.output<typeof subscriptionSchema>;

export const getUserSubscriptionSchema = z.function({
  input: [
    z.object({
      userId: z.string(),
    }),
  ],
  output: z.promise(
    makeResultSchema(subscriptionSchema.nullable(), z.instanceof(Err)),
  ),
});
export type GetUserSubscription = z.output<typeof getUserSubscriptionSchema>;

export const cancelSubscriptionSchema = z.function({
  input: [
    z.object({
      subscriptionId: z.string(),
      immediate: z.boolean().default(false),
    }),
  ],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type CancelSubscription = z.output<typeof cancelSubscriptionSchema>;
