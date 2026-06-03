/** Supported transaction currencies */
export enum Currency {
  USD = "USD",
  KHR = "KHR",
}

/** Checkout payment method options */
export enum PaymentOption {
  ABAPAY = "abapay",
  CARDS = "cards",
  ABAPAY_DEEPLINK = "abapay_deeplink",
  KHQR = "khqr",
  WECHAT = "wechat",
  ALIPAY = "alipay",
  BAKONG = "bakong",
  GOOGLE_PAY = "google_pay",
}

/** Transaction status values returned by PayWay */
export enum TransactionStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  APPROVED = "APPROVED",
  PRE_AUTH = "PRE-AUTH",
  CANCELLED = "CANCELLED",
  FAILED = "FAILED",
  DECLINED = "DECLINED",
  REFUNDED = "REFUNDED",
}

/**
 * Credentials on file token flags (customer- and merchant-initiated).
 * @see https://developer.payway.com.kh/unschedule-payment-2038908m0.md
 * @see https://developer.payway.com.kh/schedule-payment-2038907m0.md
 */
export enum TokenType {
  /** Customer-initiated, variable amount (link account/card) */
  CITI_FLEX = "CITI_FLEX",
  /** Merchant-initiated, variable amount (link account/card) */
  CITO_FLEX = "CITO_FLEX",
  /** Customer-initiated recurring registration (subscription) */
  CITR_FIX = "CITR_FIX",
  /** Customer-initiated, variable amount (pay with saved token) */
  CITU_FLEX = "CITU_FLEX",
  /** Merchant-initiated recurring billing (subscription) */
  MITR_FIX = "MITR_FIX",
  /** Merchant-initiated, variable amount (pay with saved token) */
  MITU_FLEX = "MITU_FLEX",
}

/** Scheduled subscription billing frequency */
export enum SubscriptionFrequency {
  WEEKLY = "1W",
  MONTHLY = "1M",
  BI_MONTHLY = "2M",
}

/** QR API payment option */
export enum QrPaymentOption {
  ABAPAY_KHQR = "abapay_khqr",
  WECHAT = "wechat",
  ALIPAY = "alipay",
}

/** QR / purchase transaction type */
export enum PurchaseType {
  PURCHASE = "purchase",
  PRE_AUTH = "pre-auth",
}

/** Beneficiary status for payout */
export enum BeneficiaryStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

/** Standard PayWay API status wrapper */
export interface PayWayStatus {
  code: string | number;
  message: string;
  tran_id?: string;
  trace_id?: string;
  lang?: string;
}

/** Line item for purchase requests */
export interface CheckoutItem {
  name: string;
  quantity: number;
  price: number;
}

/** Payout beneficiary entry */
export interface PayoutBeneficiary {
  account: string;
  amount: number;
}
