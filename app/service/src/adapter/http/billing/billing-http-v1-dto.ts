import z from "zod";
import {
  attachProductResultSchema,
  balanceSchema,
  cancelProductResultSchema,
  checkFeatureAccessResultSchema,
  entitlementSchema,
  getBillingPortalResultSchema,
  getEntitlementsResultSchema,
  trackUsageResultSchema,
} from "@/domain/port/billing/billing-service";

// Query params for scope selection
export const billingScopeQuerySchema = z.object({
  scope: z.enum(["user", "organization"]).optional(),
});
export type BillingScopeQuery = z.output<typeof billingScopeQuerySchema>;

// Check feature access
export const checkFeatureAccessRequestBodySchema = z.object({
  featureId: z.string(),
  requiredBalance: z.number().optional(),
  withPreview: z.boolean().optional(),
  sendEvent: z.boolean().optional(),
});
export type CheckFeatureAccessRequestBody = z.output<
  typeof checkFeatureAccessRequestBodySchema
>;

export const checkFeatureAccessResponseSchema = checkFeatureAccessResultSchema;
export type CheckFeatureAccessResponse = z.output<
  typeof checkFeatureAccessResponseSchema
>;

// Track usage
export const trackUsageRequestBodySchema = z.object({
  featureId: z.string(),
  value: z.number(),
  idempotencyKey: z.string().optional(),
  entityId: z.string().optional(),
  overageBehavior: z.enum(["cap", "allow"]).optional(),
});
export type TrackUsageRequestBody = z.output<
  typeof trackUsageRequestBodySchema
>;

export const trackUsageResponseSchema = trackUsageResultSchema;
export type TrackUsageResponse = z.output<typeof trackUsageResponseSchema>;

// Attach product
export const attachProductRequestBodySchema = z.object({
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
});
export type AttachProductRequestBody = z.output<
  typeof attachProductRequestBodySchema
>;

export const attachProductResponseSchema = attachProductResultSchema;
export type AttachProductResponse = z.output<
  typeof attachProductResponseSchema
>;

// Cancel product
export const cancelProductRequestBodySchema = z.object({
  productId: z.string(),
  cancelImmediately: z.boolean().optional(),
  entityId: z.string().optional(),
});
export type CancelProductRequestBody = z.output<
  typeof cancelProductRequestBodySchema
>;

export const cancelProductResponseSchema = cancelProductResultSchema;
export type CancelProductResponse = z.output<
  typeof cancelProductResponseSchema
>;

// Get billing portal
export const getBillingPortalResponseSchema = getBillingPortalResultSchema;
export type GetBillingPortalResponse = z.output<
  typeof getBillingPortalResponseSchema
>;

// Get entitlements
export const getEntitlementsResponseSchema = getEntitlementsResultSchema;
export type GetEntitlementsResponse = z.output<
  typeof getEntitlementsResponseSchema
>;

// Re-export for convenience
export { balanceSchema, entitlementSchema };
