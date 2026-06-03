import type { PayWayStatus } from "./common.js";

/** Transaction record by merchant reference */
export interface MerchantRefTransaction {
  transaction_id: string;
  transaction_date: string;
  apv?: string;
  payment_status: string;
  payment_status_code: number;
  original_amount: number;
  original_currency: string;
  total_amount: number;
  discount_amount: number;
  refund_amount: number;
  payment_amount: number;
  payment_currency: string;
  bank_ref?: string;
  payment_type?: string;
  payer_account?: string;
  bank_name?: string;
  merchant_ref: string;
}

export interface GetTransactionsByMerchantRefResponse {
  data: MerchantRefTransaction[];
  status: PayWayStatus;
}
