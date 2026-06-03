import { API_PATHS, QR_HASH_FIELDS } from "../constants.js";
import { PurchaseType, QrPaymentOption } from "../types/common.js";
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
   * Generate a payment QR code (ABA KHQR, WeChat, or Alipay).
   */
  async generate(options: QrGenerateOptions): Promise<QrGenerateResponse> {
    const reqTime = options.reqTime ?? formatRequestTime();
    const items =
      options.items !== undefined
        ? Buffer.from(JSON.stringify(options.items)).toString("base64")
        : undefined;
    const customFields =
      options.customFields !== undefined
        ? Buffer.from(JSON.stringify(options.customFields)).toString("base64")
        : undefined;
    const payout =
      options.payout !== undefined
        ? Buffer.from(JSON.stringify(options.payout)).toString("base64")
        : undefined;
    const callbackUrl = options.callbackUrl
      ? Buffer.from(options.callbackUrl).toString("base64")
      : undefined;
    const returnDeeplink = options.returnDeeplink
      ? Buffer.from(options.returnDeeplink).toString("base64")
      : undefined;

    const purchaseType = options.purchaseType ?? PurchaseType.PURCHASE;
    const paymentOption = options.paymentOption ?? QrPaymentOption.ABAPAY_KHQR;

    const hashValues: Record<string, string | undefined> = {
      req_time: reqTime,
      merchant_id: this.http.merchantId,
      tran_id: options.orderId,
      amount: String(options.amount),
      items,
      first_name: options.firstName,
      last_name: options.lastName,
      email: options.email,
      phone: options.phone,
      purchase_type: purchaseType,
      payment_option: paymentOption,
      callback_url: callbackUrl,
      return_deeplink: returnDeeplink,
      currency: String(options.currency),
      custom_fields: customFields,
      return_params: options.returnParams,
      payout,
      lifetime: String(options.lifetime),
      qr_image_template: options.qrImageTemplate,
    };

    const body: Record<string, string> = {
      req_time: reqTime,
      merchant_id: this.http.merchantId,
      tran_id: options.orderId,
      amount: String(options.amount),
      currency: String(options.currency),
      purchase_type: purchaseType,
      payment_option: paymentOption,
      lifetime: String(options.lifetime),
      qr_image_template: options.qrImageTemplate,
      hash: buildHash(hashValues, QR_HASH_FIELDS, this.http.apiKey),
    };

    for (const key of [
      "items",
      "first_name",
      "last_name",
      "email",
      "phone",
      "callback_url",
      "return_deeplink",
      "custom_fields",
      "return_params",
      "payout",
    ] as const) {
      const value = hashValues[key];
      if (value !== undefined) body[key] = value;
    }

    const response = await this.http.request<QrGenerateResponse>({
      path: API_PATHS.qrGenerate,
      body,
    });
    assertApiSuccess(response.status, "QR generation failed");
    return response;
  }
}
