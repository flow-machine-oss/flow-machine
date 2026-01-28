import z from "zod";
import { Err } from "@/common/err/err";
import { makeResultSchema } from "@/common/schema/result-schema";

// Balance info returned from Autumn
export const balanceSchema = z.object({
  featureId: z.string(),
  unlimited: z.boolean(),
  grantedBalance: z.number(),
  purchasedBalance: z.number(),
  currentBalance: z.number(),
  usage: z.number(),
  overageAllowed: z.boolean(),
  maxPurchase: z.number().nullable(),
  reset: z
    .object({
      interval: z.string(),
      intervalCount: z.number(),
      resetsAt: z.number(),
    })
    .nullable(),
  planId: z.string().nullable(),
});
export type Balance = z.output<typeof balanceSchema>;

// Check feature access
export const checkFeatureAccessResultSchema = z.object({
  allowed: z.boolean(),
  customerId: z.string(),
  entityId: z.string().nullable(),
  requiredBalance: z.number().optional(),
  balance: balanceSchema.nullable(),
});
export type CheckFeatureAccessResult = z.output<
  typeof checkFeatureAccessResultSchema
>;

export const checkFeatureAccessSchema = z.function({
  input: [
    z.object({
      customerId: z.string(),
      featureId: z.string(),
      requiredBalance: z.number().optional(),
      withPreview: z.boolean().optional(),
      sendEvent: z.boolean().optional(),
    }),
  ],
  output: z.promise(
    makeResultSchema(checkFeatureAccessResultSchema, z.instanceof(Err)),
  ),
});
export type CheckFeatureAccess = z.output<typeof checkFeatureAccessSchema>;

// Track usage
export const trackUsageResultSchema = z.object({
  customerId: z.string(),
  entityId: z.string().nullable(),
  eventName: z.string(),
  value: z.number(),
  balance: balanceSchema.nullable(),
});
export type TrackUsageResult = z.output<typeof trackUsageResultSchema>;

export const trackUsageSchema = z.function({
  input: [
    z.object({
      customerId: z.string(),
      featureId: z.string(),
      value: z.number(),
      idempotencyKey: z.string().optional(),
      entityId: z.string().optional(),
      overageBehavior: z.enum(["cap", "allow"]).optional(),
    }),
  ],
  output: z.promise(makeResultSchema(trackUsageResultSchema, z.instanceof(Err))),
});
export type TrackUsage = z.output<typeof trackUsageSchema>;

// Attach product
export const attachProductResultSchema = z.object({
  success: z.boolean(),
  customerId: z.string(),
  productIds: z.array(z.string()),
  code: z.string(),
  message: z.string(),
  checkoutUrl: z.string().nullable(),
});
export type AttachProductResult = z.output<typeof attachProductResultSchema>;

export const attachProductSchema = z.function({
  input: [
    z.object({
      customerId: z.string(),
      productId: z.string(),
      customerData: z
        .object({
          name: z.string().optional(),
          email: z.string().optional(),
        })
        .optional(),
      options: z
        .array(
          z.object({
            featureId: z.string(),
            quantity: z.number(),
          }),
        )
        .optional(),
      invoiceImmediately: z.boolean().optional(),
      successUrl: z.string().optional(),
    }),
  ],
  output: z.promise(
    makeResultSchema(attachProductResultSchema, z.instanceof(Err)),
  ),
});
export type AttachProduct = z.output<typeof attachProductSchema>;

// Cancel product
export const cancelProductResultSchema = z.object({
  message: z.string(),
});
export type CancelProductResult = z.output<typeof cancelProductResultSchema>;

export const cancelProductSchema = z.function({
  input: [
    z.object({
      customerId: z.string(),
      productId: z.string(),
      cancelImmediately: z.boolean().optional(),
      entityId: z.string().optional(),
    }),
  ],
  output: z.promise(
    makeResultSchema(cancelProductResultSchema, z.instanceof(Err)),
  ),
});
export type CancelProduct = z.output<typeof cancelProductSchema>;

// Get billing portal URL
export const getBillingPortalResultSchema = z.object({
  url: z.string(),
});
export type GetBillingPortalResult = z.output<
  typeof getBillingPortalResultSchema
>;

export const getBillingPortalSchema = z.function({
  input: [
    z.object({
      customerId: z.string(),
    }),
  ],
  output: z.promise(
    makeResultSchema(getBillingPortalResultSchema, z.instanceof(Err)),
  ),
});
export type GetBillingPortal = z.output<typeof getBillingPortalSchema>;

// Entitlement info for a customer
export const entitlementSchema = z.object({
  featureId: z.string(),
  balance: balanceSchema,
});
export type Entitlement = z.output<typeof entitlementSchema>;

export const getEntitlementsResultSchema = z.object({
  customerId: z.string(),
  entitlements: z.array(entitlementSchema),
  productIds: z.array(z.string()),
});
export type GetEntitlementsResult = z.output<typeof getEntitlementsResultSchema>;

export const getEntitlementsSchema = z.function({
  input: [
    z.object({
      customerId: z.string(),
    }),
  ],
  output: z.promise(
    makeResultSchema(getEntitlementsResultSchema, z.instanceof(Err)),
  ),
});
export type GetEntitlements = z.output<typeof getEntitlementsSchema>;
