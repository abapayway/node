import { API_PATHS } from "../constants.js";
import { PurchaseType } from "../types/common.js";
import type {
  PreAuthCompleteOptions,
  PreAuthCompleteWithPayoutOptions,
  PreAuthCreateOptions,
  PreAuthCreateResponse,
  PreAuthResponse,
} from "../types/pre-auth.js";
import { rsaEncrypt } from "../utils/crypto.js";
import { ValidationError } from "../utils/errors.js";
import { formatRequestTime, generateHash } from "../utils/hash.js";
import type { HttpClient } from "../utils/request.js";
import { assertApiSuccess } from "../utils/request.js";
import type { CheckoutModule } from "./checkout.js";

/**
 * Pre-authorization create, capture, and cancellation.
 */
export class PreAuthModule {
  constructor(
    private readonly http: HttpClient,
    private readonly checkout: CheckoutModule,
  ) {}

  /**
   * Create a pre-authorization hold (Purchase API with `type: pre-auth`).
   */
  async create(options: PreAuthCreateOptions): Promise<PreAuthCreateResponse> {
    return this.checkout.create({
      ...options,
      type: PurchaseType.PRE_AUTH,
    });
  }

  /**
   * Capture funds after initial pre-authorization.
   */
  async complete(transactionId: string, options: PreAuthCompleteOptions): Promise<PreAuthResponse> {
    return this.completeInternal(transactionId, options, API_PATHS.preAuthCompletion);
  }

  /**
   * Capture pre-authorized funds with payout distribution.
   */
  async completeWithPayout(
    transactionId: string,
    options: PreAuthCompleteWithPayoutOptions,
  ): Promise<PreAuthResponse> {
    return this.completeInternal(transactionId, options, API_PATHS.preAuthCompletionWithPayout);
  }

  /**
   * Release a pre-authorization hold without capturing.
   */
  async cancel(transactionId: string): Promise<PreAuthResponse> {
    const rsaKey = this.requireRsaKey();
    const requestTime = formatRequestTime();
    const authPayload = JSON.stringify({
      mc_id: this.http.merchantId,
      tran_id: transactionId,
    });
    const merchantAuth = rsaEncrypt(authPayload, rsaKey);
    const hash = generateHash(this.http.merchantId + merchantAuth + requestTime, this.http.apiKey);

    const response = await this.http.request<PreAuthResponse>({
      path: API_PATHS.preAuthCancellation,
      body: {
        request_time: requestTime,
        merchant_id: this.http.merchantId,
        merchant_auth: merchantAuth,
        hash,
      },
    });
    assertApiSuccess(response.status, "Cancel pre-auth failed");
    return response;
  }

  private async completeInternal(
    transactionId: string,
    options: PreAuthCompleteOptions,
    path: string,
  ): Promise<PreAuthResponse> {
    const rsaKey = this.requireRsaKey();
    const requestTime = formatRequestTime();
    const authPayload: Record<string, unknown> = {
      mc_id: this.http.merchantId,
      tran_id: transactionId,
      complete_amount: String(options.amount),
    };

    if ("payout" in options && options.payout) {
      authPayload.payout = options.payout;
    }

    const merchantAuth = rsaEncrypt(JSON.stringify(authPayload), rsaKey);
    const hash = generateHash(requestTime + this.http.merchantId + merchantAuth, this.http.apiKey);

    const response = await this.http.request<PreAuthResponse>({
      path,
      body: {
        request_time: requestTime,
        merchant_id: this.http.merchantId,
        merchant_auth: merchantAuth,
        hash,
      },
    });
    assertApiSuccess(response.status, "Complete pre-auth failed");
    return response;
  }

  private requireRsaKey(): string {
    const key = this.http.rsaPublicKey;
    if (!key) {
      throw new ValidationError(
        "rsaPublicKey is required in client config for pre-auth operations",
      );
    }
    return key;
  }
}
