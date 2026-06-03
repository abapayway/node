import { API_PATHS } from "../constants.js";
import type { RefundCreateOptions, RefundResponse } from "../types/refund.js";
import { rsaEncrypt } from "../utils/crypto.js";
import { RefundError, ValidationError } from "../utils/errors.js";
import { formatRequestTime, generateHash } from "../utils/hash.js";
import type { HttpClient } from "../utils/request.js";
import { assertApiSuccess } from "../utils/request.js";

/**
 * Refund operations (full or partial within 30 days).
 */
export class RefundModule {
  constructor(private readonly http: HttpClient) {}

  /**
   * Issue a full or partial refund for a transaction.
   */
  async create(transactionId: string, options: RefundCreateOptions = {}): Promise<RefundResponse> {
    const rsaKey = this.http.rsaPublicKey;
    if (!rsaKey) {
      throw new ValidationError("rsaPublicKey is required in client config for refund operations");
    }

    const requestTime = formatRequestTime();
    const authPayload = JSON.stringify({
      mc_id: this.http.merchantId,
      tran_id: transactionId,
      refund_amount: options.amount !== undefined ? String(options.amount) : undefined,
    });
    const merchantAuth = rsaEncrypt(authPayload, rsaKey);
    const b4hash = requestTime + this.http.merchantId + merchantAuth;
    const hash = generateHash(b4hash, this.http.apiKey);

    const body = {
      request_time: requestTime,
      merchant_id: this.http.merchantId,
      merchant_auth: merchantAuth,
      hash,
    };

    try {
      const response = await this.http.request<RefundResponse>({
        path: API_PATHS.refund,
        body,
      });
      assertApiSuccess(response.status);
      return response;
    } catch (error) {
      if (error instanceof RefundError) throw error;
      throw new RefundError(error instanceof Error ? error.message : "Refund failed", {
        raw: error,
        cause: error instanceof Error ? error : undefined,
      });
    }
  }
}
