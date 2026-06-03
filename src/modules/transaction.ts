import { API_PATHS } from "../constants.js";
import type { GetTransactionsByMerchantRefResponse } from "../types/transaction.js";
import { buildHash, formatRequestTime } from "../utils/hash.js";
import type { HttpClient } from "../utils/request.js";
import { assertApiSuccess } from "../utils/request.js";

/**
 * KHQR / merchant reference transaction lookups.
 */
export class TransactionModule {
  constructor(private readonly http: HttpClient) {}

  /**
   * Retrieve purchase transactions by merchant reference number.
   */
  async getByMerchantRef(merchantRef: string): Promise<GetTransactionsByMerchantRefResponse> {
    const reqTime = formatRequestTime();
    const body = {
      req_time: reqTime,
      merchant_id: this.http.merchantId,
      merchant_ref: merchantRef,
      hash: buildHash(
        {
          req_time: reqTime,
          merchant_id: this.http.merchantId,
          merchant_ref: merchantRef,
        },
        ["req_time", "merchant_id", "merchant_ref"],
        this.http.apiKey,
      ),
    };

    const response = await this.http.request<GetTransactionsByMerchantRefResponse>({
      path: API_PATHS.getTransactionsByMcRef,
      body,
    });
    assertApiSuccess(response.status);
    return response;
  }
}
