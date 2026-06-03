import type { Currency, PaymentOption, SubscriptionFrequency, TokenType } from "./common.js";
import type { CheckoutItem } from "./common.js";

export interface LinkAccountOptions {
  ctid: string;
  requestId: string;
  tokenFlag: TokenType | string;
  currency: Currency | string;
  returnDeeplink?: string;
  callbackUrl?: string;
  requestTime?: string;
}

export interface LinkAccountResponse {
  status: { code: string; message: string; trace_id: string };
  data: { deeplink: string; qr_string: string; expire_in: number };
}

export interface LinkCardOptions {
  ctid: string;
  requestId: string;
  tokenFlag: TokenType | string;
  currency: Currency | string;
  callbackUrl?: string;
  /** Base64-encoded URL shown on PayWay success screen (Done button) */
  continueSuccessUrl?: string;
  /** Optional amount field for hash when required by profile */
  amount?: number;
  /** Optional frequency (empty for CITI_FLEX / CITO_FLEX) */
  frequency?: SubscriptionFrequency | string;
  requestTime?: string;
}

export interface LinkCardResponse {
  html: string;
}

export interface TokenPaymentOptions {
  amount: number;
  currency: Currency | string;
  orderId: string;
  tokenType: TokenType | string;
  returnUrl?: string;
  items?: string;
  customFields?: Record<string, unknown>;
}

export interface TokenPaymentResponse {
  status: { code: string; message: string };
  data?: Record<string, unknown>;
}

export interface RenewTokenResponse {
  status: { code: string; message: string; trace_id?: string };
  data?: Record<string, unknown>;
}

export interface TokenDetailsResponse {
  status: { code: string; message: string };
  data?: {
    token: string;
    masked_account?: string;
    token_flag?: string;
  };
}

export interface RemoveTokenResponse {
  status: { code: string; message: string };
}

export interface SubscribeOptions {
  ctid: string;
  requestId: string;
  amount: number;
  currency: Currency | string;
  returnUrl: string;
  /** Defaults to CITR_FIX for scheduled subscription registration */
  tokenFlag?: TokenType | string;
  /** Required for CITR_FIX — `1W`, `1M`, or `2M` */
  frequency: SubscriptionFrequency | string;
  paymentOption?: PaymentOption | string;
  items?: CheckoutItem[];
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  reqTime?: string;
}

export interface SubscribeResponse {
  html?: string;
  status?: { code: string; message: string };
}
