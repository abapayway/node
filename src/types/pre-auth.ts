import type { CheckoutCreateOptions, CheckoutCreateResponse } from "./checkout.js";
import type { PayWayStatus } from "./common.js";

/** Options for creating a pre-authorization (Purchase API with `type: pre-auth`) */
export type PreAuthCreateOptions = Omit<CheckoutCreateOptions, "type">;

export type PreAuthCreateResponse = CheckoutCreateResponse;

export interface PreAuthCompleteOptions {
  /** Amount to capture */
  amount: number;
}

export interface PreAuthCompleteWithPayoutOptions extends PreAuthCompleteOptions {
  payout?: Array<{ acc: string; amt: number }>;
}

export interface PreAuthResponse {
  grand_total: number;
  currency: string;
  transaction_status: string;
  status: PayWayStatus;
}
