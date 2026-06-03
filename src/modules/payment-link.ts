import { API_PATHS } from "../constants.js";
import type {
  PaymentLinkCreateOptions,
  PaymentLinkCreateResponse,
  PaymentLinkGetResponse,
} from "../types/payment-link.js";
import { rsaEncrypt } from "../utils/crypto.js";
import { ValidationError } from "../utils/errors.js";
import { buildHash, formatRequestTime } from "../utils/hash.js";
import type { HttpClient } from "../utils/request.js";
import { assertApiSuccess } from "../utils/request.js";

/**
 * Payment link creation and retrieval.
 */
export class PaymentLinkModule {
  constructor(private readonly http: HttpClient) {}

  /**
   * Create a shareable payment link.
   */
  async create(options: PaymentLinkCreateOptions): Promise<PaymentLinkCreateResponse> {
    const rsaKey = this.http.rsaPublicKey;
    if (!rsaKey) {
      throw new ValidationError(
        "rsaPublicKey is required in client config for payment link operations",
      );
    }

    const requestTime = formatRequestTime();
    const authData = JSON.stringify({
      mc_id: this.http.merchantId,
      title: options.title,
      amount: options.amount,
      currency: options.currency,
      description: options.description,
      payment_limit: options.paymentLimit,
      expired_date: options.expiredDate,
      return_url: Buffer.from(options.returnUrl).toString("base64"),
      merchant_ref_no: options.merchantRefNo,
      payout: options.payout ? JSON.stringify(options.payout) : undefined,
    });

    const merchantAuth = rsaEncrypt(authData, rsaKey);
    const hash = buildHash(
      { request_time: requestTime, merchant_id: this.http.merchantId, merchant_auth: merchantAuth },
      ["request_time", "merchant_id", "merchant_auth"],
      this.http.apiKey,
    );

    const form = new FormData();
    form.append("request_time", requestTime);
    form.append("merchant_id", this.http.merchantId);
    form.append("merchant_auth", merchantAuth);
    form.append("hash", hash);
    if (options.image) {
      form.append("image", options.image);
    }

    const response = await this.http.request<PaymentLinkCreateResponse>({
      path: API_PATHS.paymentLinkCreate,
      body: form,
    });
    assertApiSuccess(response.status, "Create payment link failed");
    return response;
  }

  /**
   * Retrieve details of an existing payment link.
   */
  async get(linkId: string): Promise<PaymentLinkGetResponse> {
    const requestTime = formatRequestTime();
    const body = {
      request_time: requestTime,
      merchant_id: this.http.merchantId,
      payment_link_id: linkId,
      hash: buildHash(
        {
          request_time: requestTime,
          merchant_id: this.http.merchantId,
          payment_link_id: linkId,
        },
        ["request_time", "merchant_id", "payment_link_id"],
        this.http.apiKey,
      ),
    };

    const response = await this.http.request<PaymentLinkGetResponse>({
      path: API_PATHS.paymentLinkGet,
      body,
    });
    assertApiSuccess(response.status, "Get payment link failed");
    return response;
  }
}
