import { API_PATHS } from "../constants.js";
import type {
  LinkAccountOptions,
  LinkAccountResponse,
  LinkCardOptions,
  LinkCardResponse,
  RemoveTokenResponse,
  RenewTokenResponse,
  SubscribeOptions,
  SubscribeResponse,
  TokenDetailsResponse,
  TokenPaymentOptions,
  TokenPaymentResponse,
} from "../types/credentials.js";
import { buildHash, formatRequestTime } from "../utils/hash.js";
import type { HttpClient } from "../utils/request.js";
import { assertApiSuccess } from "../utils/request.js";

/**
 * Credentials on file (tokenized payments).
 */
export class CredentialsModule {
  constructor(private readonly http: HttpClient) {}

  /**
   * Link an ABA account — returns QR code or ABA Mobile deeplink.
   */
  async linkAccount(options: LinkAccountOptions): Promise<LinkAccountResponse> {
    const requestTime = options.requestTime ?? formatRequestTime();
    const callbackUrl = options.callbackUrl
      ? Buffer.from(options.callbackUrl).toString("base64")
      : undefined;

    const hashValues = {
      merchant_id: this.http.merchantId,
      request_time: requestTime,
      ctid: options.ctid,
      return_deeplink: options.returnDeeplink,
      callback_url: callbackUrl,
      request_id: options.requestId,
      token_flag: options.tokenFlag,
      currency: options.currency,
    };

    const body = {
      merchant_id: this.http.merchantId,
      request_time: requestTime,
      ctid: options.ctid,
      request_id: options.requestId,
      token_flag: options.tokenFlag,
      currency: options.currency,
      return_deeplink: options.returnDeeplink,
      callback_url: callbackUrl,
      hash: buildHash(
        hashValues,
        [
          "merchant_id",
          "request_time",
          "ctid",
          "return_deeplink",
          "callback_url",
          "request_id",
          "token_flag",
          "currency",
        ],
        this.http.apiKey,
      ),
    };

    const response = await this.http.request<LinkAccountResponse>({
      path: API_PATHS.linkAccount,
      body,
    });
    assertApiSuccess(response.status, "Link account failed");
    return response;
  }

  /**
   * Link a card — returns HTML for card entry form.
   */
  async linkCard(options: LinkCardOptions): Promise<LinkCardResponse> {
    const requestTime = options.requestTime ?? formatRequestTime();
    const callbackUrl = options.callbackUrl
      ? Buffer.from(options.callbackUrl).toString("base64")
      : undefined;

    const hashValues = {
      merchant_id: this.http.merchantId,
      request_time: requestTime,
      ctid: options.ctid,
      callback_url: callbackUrl,
      request_id: options.requestId,
      token_flag: options.tokenFlag,
      currency: options.currency,
      return_url: options.returnUrl,
    };

    const body = {
      merchant_id: this.http.merchantId,
      request_time: requestTime,
      ctid: options.ctid,
      request_id: options.requestId,
      token_flag: options.tokenFlag,
      currency: options.currency,
      callback_url: callbackUrl,
      return_url: options.returnUrl,
      hash: buildHash(
        hashValues,
        [
          "merchant_id",
          "request_time",
          "ctid",
          "callback_url",
          "request_id",
          "token_flag",
          "currency",
          "return_url",
        ],
        this.http.apiKey,
      ),
    };

    const response = await this.http.request<LinkCardResponse>({
      path: API_PATHS.linkCard,
      body,
    });
    assertApiSuccess(response.status, "Link card failed");
    return response;
  }

  /**
   * Initiate a payment using a stored token.
   */
  async payment(token: string, options: TokenPaymentOptions): Promise<TokenPaymentResponse> {
    const reqTime = formatRequestTime();
    const customFields =
      options.customFields !== undefined
        ? Buffer.from(JSON.stringify(options.customFields)).toString("base64")
        : undefined;

    const hashValues = {
      req_time: reqTime,
      merchant_id: this.http.merchantId,
      tran_id: options.orderId,
      amount: String(options.amount),
      ctid: token,
      pwt: options.tokenType,
      currency: options.currency,
      return_url: options.returnUrl,
      items: options.items,
      custom_fields: customFields,
    };

    const body = {
      ...hashValues,
      hash: buildHash(
        hashValues,
        [
          "req_time",
          "merchant_id",
          "tran_id",
          "amount",
          "items",
          "shipping",
          "ctid",
          "pwt",
          "firstname",
          "lastname",
          "email",
          "phone",
          "type",
          "return_url",
          "currency",
          "custom_fields",
          "return_params",
          "payout",
        ],
        this.http.apiKey,
      ),
    };

    const response = await this.http.request<TokenPaymentResponse>({
      path: API_PATHS.cofPayment,
      body: body as Record<string, string>,
    });
    assertApiSuccess(response.status, "Token payment failed");
    return response;
  }

  /**
   * Renew an expiring CITI_FLEX or CITO_FLEX token.
   */
  async renewToken(token: string): Promise<RenewTokenResponse> {
    const requestTime = formatRequestTime();
    const body = {
      merchant_id: this.http.merchantId,
      request_time: requestTime,
      token,
      hash: buildHash(
        { merchant_id: this.http.merchantId, request_time: requestTime, token },
        ["merchant_id", "request_time", "token"],
        this.http.apiKey,
      ),
    };

    const response = await this.http.request<RenewTokenResponse>({
      path: API_PATHS.renewToken,
      body,
    });
    assertApiSuccess(response.status, "Renew token failed");
    return response;
  }

  /**
   * Manually retrieve linked account or card details for a token.
   */
  async getTokenDetails(token: string): Promise<TokenDetailsResponse> {
    const requestTime = formatRequestTime();
    const body = {
      merchant_id: this.http.merchantId,
      request_time: requestTime,
      token,
      hash: buildHash(
        { merchant_id: this.http.merchantId, request_time: requestTime, token },
        ["merchant_id", "request_time", "token"],
        this.http.apiKey,
      ),
    };

    const response = await this.http.request<TokenDetailsResponse>({
      path: API_PATHS.getTokenDetails,
      body,
    });
    assertApiSuccess(response.status, "Get token details failed");
    return response;
  }

  /**
   * Remove a linked account or card token (irreversible).
   */
  async removeToken(token: string): Promise<RemoveTokenResponse> {
    const reqTime = formatRequestTime();
    const body = {
      req_time: reqTime,
      merchant_id: this.http.merchantId,
      ctid: token,
      hash: buildHash(
        { req_time: reqTime, merchant_id: this.http.merchantId, ctid: token },
        ["req_time", "merchant_id", "ctid"],
        this.http.apiKey,
      ),
    };

    const response = await this.http.request<RemoveTokenResponse>({
      path: API_PATHS.removeToken,
      body,
    });
    assertApiSuccess(response.status, "Remove token failed");
    return response;
  }

  /**
   * Purchase while linking customer card/account (subscription flow).
   */
  async subscribe(options: SubscribeOptions): Promise<SubscribeResponse> {
    const reqTime = options.requestTime ?? formatRequestTime();
    const items = options.items;

    const fields: Record<string, string | undefined> = {
      req_time: reqTime,
      merchant_id: this.http.merchantId,
      tran_id: options.requestId,
      amount: String(options.amount),
      ctid: options.ctid,
      currency: options.currency,
      return_url: options.returnUrl,
      items,
      token_flag: options.tokenFlag,
    };

    const hash = buildHash(
      fields,
      ["req_time", "merchant_id", "tran_id", "amount", "ctid", "currency", "return_url", "items"],
      this.http.apiKey,
    );

    const body: Record<string, string> = {};
    for (const [k, v] of Object.entries(fields)) {
      if (v !== undefined) body[k] = v;
    }
    body.hash = hash;

    const html = await this.http.request<string>({
      path: API_PATHS.cofSubscribe,
      contentType: "multipart",
      body,
      rawResponse: true,
    });

    return { html };
  }
}
