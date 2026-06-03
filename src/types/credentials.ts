import type { Currency, TokenType } from "./common.js";

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
  returnUrl?: string;
  requestTime?: string;
}

export interface LinkCardResponse {
  status: { code: string; message: string; trace_id: string };
  data: { html: string };
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

export interface SubscribeOptions extends LinkAccountOptions {
  amount: number;
  returnUrl: string;
  items?: string;
}

export interface SubscribeResponse {
  html?: string;
  status?: { code: string; message: string };
}
