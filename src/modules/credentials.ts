import { API_PATHS, LINK_CARD_HASH_FIELDS } from "../constants.js";
import { TokenType } from "../types/common.js";
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
import type { CheckoutModule } from "./checkout.js";

/**
 * Credentials on file (tokenized payments).
 */
export class CredentialsModule {
  constructor(
    private readonly http: HttpClient,
    private readonly checkout: CheckoutModule,
  ) {}

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
    const continueSuccessUrl = options.continueSuccessUrl
      ? Buffer.from(options.continueSuccessUrl).toString("base64")
      : undefined;

    const hashValues: Record<string, string | undefined> = {
      merchant_id: this.http.merchantId,
      request_time: requestTime,
      ctid: options.ctid,
      callback_url: callbackUrl,
      request_id: options.requestId,
      token_flag: options.tokenFlag,
      frequency: options.frequency,
      amount: options.amount !== undefined ? String(options.amount) : undefined,
      currency: String(options.currency),
      continue_success_url: continueSuccessUrl,
    };

    const body: Record<string, string> = {
      merchant_id: this.http.merchantId,
      request_time: requestTime,
      ctid: options.ctid,
      request_id: options.requestId,
      token_flag: String(options.tokenFlag),
      currency: String(options.currency),
      hash: buildHash(hashValues, LINK_CARD_HASH_FIELDS, this.http.apiKey),
    };

    if (callbackUrl) body.callback_url = callbackUrl;
    if (continueSuccessUrl) body.continue_success_url = continueSuccessUrl;
    if (options.amount !== undefined) body.amount = String(options.amount);
    if (options.frequency) body.frequency = String(options.frequency);

    const html = await this.http.request<string>({
      path: API_PATHS.linkCard,
      contentType: "multipart",
      body,
      rawResponse: true,
    });

    return { html };
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
   * Scheduled subscription registration (CITR_FIX) or combined link-and-pay.
   * Uses Purchase API with `token_flag` and `frequency`.
   */
  async subscribe(options: SubscribeOptions): Promise<SubscribeResponse> {
    const result = await this.checkout.create({
      orderId: options.requestId,
      amount: options.amount,
      currency: options.currency,
      returnUrl: options.returnUrl,
      ctid: options.ctid,
      tokenFlag: options.tokenFlag ?? TokenType.CITR_FIX,
      frequency: options.frequency,
      paymentOption: options.paymentOption,
      items: options.items,
      firstName: options.firstName,
      lastName: options.lastName,
      email: options.email,
      phone: options.phone,
      reqTime: options.reqTime,
    });

    return { html: result.html };
  }

  /**
   * Charge a scheduled subscriber on a recurring cycle (MITR_FIX).
   */
  async chargeSubscription(
    token: string,
    options: TokenPaymentOptions,
  ): Promise<TokenPaymentResponse> {
    return this.payment(token, {
      ...options,
      tokenType: options.tokenType ?? TokenType.MITR_FIX,
    });
  }
}
