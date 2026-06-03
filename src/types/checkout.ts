import type { CheckoutItem, Currency, PayWayStatus, PaymentOption } from "./common.js";

/** Options for creating a checkout / purchase transaction */
export interface CheckoutCreateOptions {
  /** Unique transaction ID (merchant-generated) */
  orderId: string;
  /** Transaction amount */
  amount: number;
  /** Transaction currency */
  currency: Currency | string;
  /** Line items (will be base64-encoded JSON) */
  items?: CheckoutItem[];
  /** Shipping fee */
  shipping?: number;
  /** Customer first name */
  firstName?: string;
  /** Customer last name */
  lastName?: string;
  /** Customer email */
  email?: string;
  /** Customer phone */
  phone?: string;
  /** Transaction type, e.g. `pre-auth` for pre-authorization */
  type?: string;
  /** Selected payment method */
  paymentOption?: PaymentOption | string;
  /** URL after successful payment */
  returnUrl?: string;
  /** URL when payment is cancelled */
  cancelUrl?: string;
  /** Continue success URL */
  continueSuccessUrl?: string;
  /** Base64-encoded deeplink JSON for mobile return */
  returnDeeplink?: string;
  /** Notification / callback URL (base64-encoded if required) */
  notificationUrl?: string;
  /** Custom fields (object, encoded by SDK) */
  customFields?: Record<string, unknown>;
  /** Return params passed through to callback */
  returnParams?: string;
  /** Payout instructions */
  payout?: Array<{ acc: string; amt: number }>;
  /** Link lifetime in minutes */
  lifetime?: number;
  /** Additional params JSON string */
  additionalParams?: string;
  /** Google Pay token */
  googlePayToken?: string;
  /** Skip success page flag */
  skipSuccessPage?: string;
  /** Consumer token ID for saved payment */
  ctid?: string;
  /** View type: `hosted` for mobile */
  viewType?: string;
  /** Pre-request time override */
  reqTime?: string;
}

/** HTML checkout response from purchase API */
export interface CheckoutCreateResponse {
  html: string;
}

/** Transaction operation history entry */
export interface TransactionOperation {
  status: string;
  amount: number;
  transaction_date: string;
  bank_ref?: string;
}

/** Full transaction details */
export interface TransactionDetail {
  transaction_id: string;
  payment_status_code: number;
  payment_status: string;
  original_amount: number;
  original_currency: string;
  payment_amount: number;
  payment_currency: string;
  total_amount: number;
  refund_amount: number;
  discount_amount: number;
  apv?: string;
  transaction_date: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  bank_ref?: string;
  payment_type?: string;
  payer_account?: string;
  bank_name?: string;
  card_source?: string;
  transaction_operations?: TransactionOperation[];
}

export interface TransactionDetailResponse {
  data: TransactionDetail;
  status: PayWayStatus;
}

/** Check transaction status response */
export interface CheckTransactionData {
  payment_status_code: number;
  payment_status: string;
  total_amount: number;
  original_amount: number;
  refund_amount: number;
  discount_amount: number;
  payment_amount: number;
  payment_currency: string;
  apv?: string;
  transaction_date: string;
}

export interface CheckTransactionResponse {
  data: CheckTransactionData;
  status: PayWayStatus;
}

export interface CloseTransactionResponse {
  status: PayWayStatus;
}

/** Filters for transaction list */
export interface TransactionListFilters {
  fromDate?: string;
  toDate?: string;
  amount?: number;
  paymentType?: string;
  paymentStatus?: string;
  page?: number;
  pageSize?: number;
}

export interface TransactionListItem {
  transaction_id: string;
  payment_status: string;
  amount: number;
  currency: string;
  transaction_date: string;
}

export interface TransactionListResponse {
  data: TransactionListItem[];
  status: PayWayStatus;
}

/** Exchange rate for a currency pair */
export interface ExchangeRatePair {
  buy: string;
  sell: string;
}

export interface ExchangeRateResponse {
  status: PayWayStatus;
  exchange_rates: Record<string, ExchangeRatePair>;
}
