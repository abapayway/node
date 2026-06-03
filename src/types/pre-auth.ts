import type { PayWayStatus } from "./common.js";

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
