import type { CheckoutItem, Currency, PurchaseType, QrPaymentOption } from "./common.js";

export interface QrGenerateOptions {
  /** Unique transaction ID */
  orderId: string;
  /** Transaction amount (min 100 KHR or 0.01 USD) */
  amount: number;
  currency: Currency | string;
  /** QR payment channel (default: abapay_khqr) */
  paymentOption?: QrPaymentOption | string;
  /** `purchase` or `pre-auth` (Alipay/WeChat do not support pre-auth) */
  purchaseType?: PurchaseType | string;
  /** QR lifetime in minutes (min 3, max 120 days) */
  lifetime: number;
  /** QR image template id (e.g. template3_color) */
  qrImageTemplate: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  items?: CheckoutItem[];
  /** Callback URL (plain; SDK base64-encodes for API) */
  callbackUrl?: string;
  returnDeeplink?: string;
  customFields?: Record<string, unknown>;
  returnParams?: string;
  payout?: Array<{ account: string; amount: number }>;
  reqTime?: string;
}

export interface QrGenerateResponse {
  qrString: string;
  qrImage: string;
  abapay_deeplink: string;
  app_store: string;
  play_store: string;
  amount: number;
  currency: string;
  status: {
    code: string;
    message: string;
    trace_id?: string;
  };
}
