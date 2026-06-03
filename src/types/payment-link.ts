import type { Currency, PayWayStatus } from "./common.js";

export interface PaymentLinkCreateOptions {
  title: string;
  amount: number;
  currency: Currency | string;
  description?: string;
  paymentLimit?: number;
  expiredDate: number | string;
  returnUrl: string;
  merchantRefNo?: string;
  payout?: Array<{ acc: string; amt: number }>;
  image?: Blob;
}

export interface PaymentLinkData {
  id: string;
  title: string;
  amount: number;
  currency: string;
  status: string;
  description?: string;
  payment_limit?: number;
  payment_link: string;
  return_url: string;
  merchant_ref_no?: string;
  created_at: string;
  expired_date: number;
}

export interface PaymentLinkCreateResponse {
  data: PaymentLinkData;
  status: PayWayStatus;
  tran_id?: string;
}

export interface PaymentLinkGetResponse {
  data: PaymentLinkData;
  status: PayWayStatus;
}
