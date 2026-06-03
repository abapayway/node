import type { PayWayStatus } from "./common.js";

/** Options for creating a refund */
export interface RefundCreateOptions {
  /** Partial refund amount; omit for full refund */
  amount?: number;
}

export interface RefundResponse {
  grand_total: number;
  total_refunded: number;
  currency: string;
  transaction_status: string;
  status: PayWayStatus;
}
