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

/** Credentials on file token types */
export enum TokenType {
  CITI_FLEX = "CITI_FLEX",
  CITO_FLEX = "CITO_FLEX",
  CITR_FIX = "CITR_FIX",
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
