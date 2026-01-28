import {
  makeAttachProduct,
  makeCancelProduct,
  makeCheckFeatureAccess,
  makeGetBillingPortal,
  makeGetEntitlements,
  makeTrackUsage,
} from "@/adapter/billing/autumn-billing-adapter";
import { makeBillingHttpV1Router } from "@/adapter/http/billing/billing-http-v1-router";
import { getActiveMember, getSession } from "@/di/auth-di";

export const checkFeatureAccess = makeCheckFeatureAccess();
export const trackUsage = makeTrackUsage();
export const attachProduct = makeAttachProduct();
export const cancelProduct = makeCancelProduct();
export const getBillingPortal = makeGetBillingPortal();
export const getEntitlements = makeGetEntitlements();

export const billingHttpV1Router = makeBillingHttpV1Router({
  getSession,
  getActiveMember,
  checkFeatureAccess,
  trackUsage,
  attachProduct,
  cancelProduct,
  getBillingPortal,
  getEntitlements,
});
