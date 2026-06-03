import type { Currency } from "./common.js";

export interface QrGenerateOptions {
  /** Transaction amount */
  amount: number;
  /** Currency code */
  currency: Currency | string;
  /** Unique transaction / order ID */
  orderId: string;
  /** Merchant reference for KHQR */
  merchantRef?: string;
  /** Optional callback URL */
  callbackUrl?: string;
}

export interface QrGenerateResponse {
  status: { code: string; message: string };
  data?: {
    qr_string?: string;
    qr_image?: string;
    tran_id?: string;
  };
}
