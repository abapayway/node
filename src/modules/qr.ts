import { API_PATHS } from "../constants.js";
import type { QrGenerateOptions, QrGenerateResponse } from "../types/qr.js";
import { buildHash, formatRequestTime } from "../utils/hash.js";
import type { HttpClient } from "../utils/request.js";
import { assertApiSuccess } from "../utils/request.js";

/**
 * ABA QR code generation for online and in-store merchants.
 */
export class QrModule {
  constructor(private readonly http: HttpClient) {}

  /**
   * Generate a payment QR code.
   */
  async generate(options: QrGenerateOptions): Promise<QrGenerateResponse> {
    const reqTime = formatRequestTime();
    const hashValues = {
      req_time: reqTime,
      merchant_id: this.http.merchantId,
      tran_id: options.orderId,
      amount: String(options.amount),
      currency: options.currency,
      merchant_ref: options.merchantRef,
      callback_url: options.callbackUrl,
    };

    const fieldOrder = [
      "req_time",
      "merchant_id",
      "tran_id",
      "amount",
      "currency",
      "merchant_ref",
      "callback_url",
    ] as const;

    const body: Record<string, string> = {
      req_time: reqTime,
      merchant_id: this.http.merchantId,
      tran_id: options.orderId,
      amount: String(options.amount),
      currency: String(options.currency),
      hash: buildHash(hashValues, fieldOrder, this.http.apiKey),
    };

    if (options.merchantRef) body.merchant_ref = options.merchantRef;
    if (options.callbackUrl) body.callback_url = options.callbackUrl;

    const response = await this.http.request<QrGenerateResponse>({
      path: API_PATHS.qrGenerate,
      body,
    });
    assertApiSuccess(response.status, "QR generation failed");
    return response;
  }
}
