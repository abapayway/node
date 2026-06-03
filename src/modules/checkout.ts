import { API_PATHS, PURCHASE_HASH_FIELDS } from "../constants.js";
import type {
  CheckTransactionResponse,
  CheckoutCreateOptions,
  CheckoutCreateResponse,
  CloseTransactionResponse,
  ExchangeRateResponse,
  TransactionDetailResponse,
  TransactionListFilters,
  TransactionListResponse,
} from "../types/checkout.js";
import { buildHash, formatRequestTime } from "../utils/hash.js";
import type { HttpClient } from "../utils/request.js";
import { assertApiSuccess } from "../utils/request.js";

/**
 * Ecommerce checkout operations (purchase, transaction queries, exchange rates).
 */
export class CheckoutModule {
  constructor(private readonly http: HttpClient) {}

  /**
   * Initiate a payment transaction (Purchase API). Returns checkout HTML.
   */
  async create(options: CheckoutCreateOptions): Promise<CheckoutCreateResponse> {
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

    const fields: Record<string, string | undefined> = {
      req_time: reqTime,
      merchant_id: this.http.merchantId,
      tran_id: options.orderId,
      amount: String(options.amount),
      items,
      shipping: options.shipping !== undefined ? String(options.shipping) : undefined,
      firstname: options.firstName,
      lastname: options.lastName,
      email: options.email,
      phone: options.phone,
      type: options.type,
      payment_option: options.paymentOption,
      return_url: options.returnUrl,
      cancel_url: options.cancelUrl,
      continue_success_url: options.continueSuccessUrl,
      return_deeplink: options.returnDeeplink,
      currency: options.currency,
      custom_fields: customFields,
      return_params: options.returnParams ?? options.notificationUrl,
      payout,
      lifetime: options.lifetime !== undefined ? String(options.lifetime) : undefined,
      additional_params: options.additionalParams,
      google_pay_token: options.googlePayToken,
      skip_success_page: options.skipSuccessPage,
      ctid: options.ctid,
      token_flag: options.tokenFlag,
      frequency: options.frequency,
      view_type: options.viewType,
    };

    const hash = buildHash(fields, PURCHASE_HASH_FIELDS, this.http.apiKey);
    const body: Record<string, string> = {};
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) body[key] = value;
    }
    body.hash = hash;

    const html = await this.http.request<string>({
      path: API_PATHS.purchase,
      contentType: "multipart",
      body,
      rawResponse: true,
    });

    return { html };
  }

  /**
   * Get full transaction details including history.
   */
  async getTransaction(transactionId: string): Promise<TransactionDetailResponse> {
    const reqTime = formatRequestTime();
    const body = {
      req_time: reqTime,
      merchant_id: this.http.merchantId,
      tran_id: transactionId,
      hash: buildHash(
        { req_time: reqTime, merchant_id: this.http.merchantId, tran_id: transactionId },
        ["req_time", "merchant_id", "tran_id"],
        this.http.apiKey,
      ),
    };

    const response = await this.http.request<TransactionDetailResponse>({
      path: API_PATHS.transactionDetail,
      body,
    });
    assertApiSuccess(response.status);
    return response;
  }

  /**
   * Cancel a transaction (sets status to CANCELLED).
   */
  async closeTransaction(transactionId: string): Promise<CloseTransactionResponse> {
    const reqTime = formatRequestTime();
    const body = {
      req_time: reqTime,
      merchant_id: this.http.merchantId,
      tran_id: transactionId,
      hash: buildHash(
        { req_time: reqTime, merchant_id: this.http.merchantId, tran_id: transactionId },
        ["req_time", "merchant_id", "tran_id"],
        this.http.apiKey,
      ),
    };

    const response = await this.http.request<CloseTransactionResponse>({
      path: API_PATHS.closeTransaction,
      body,
    });
    assertApiSuccess(response.status);
    return response;
  }

  /**
   * Get transaction status (transactions within 7 days only).
   */
  async checkTransaction(transactionId: string): Promise<CheckTransactionResponse> {
    const reqTime = formatRequestTime();
    const body = {
      req_time: reqTime,
      merchant_id: this.http.merchantId,
      tran_id: transactionId,
      hash: buildHash(
        { req_time: reqTime, merchant_id: this.http.merchantId, tran_id: transactionId },
        ["req_time", "merchant_id", "tran_id"],
        this.http.apiKey,
      ),
    };

    const response = await this.http.request<CheckTransactionResponse>({
      path: API_PATHS.checkTransaction,
      body,
    });
    assertApiSuccess(response.status);
    return response;
  }

  /**
   * Get paginated list of transactions filtered by criteria.
   */
  async getTransactionList(filters: TransactionListFilters = {}): Promise<TransactionListResponse> {
    const reqTime = formatRequestTime();
    const hashFields: Record<string, string | undefined> = {
      req_time: reqTime,
      merchant_id: this.http.merchantId,
      from_date: filters.fromDate,
      to_date: filters.toDate,
      amount: filters.amount !== undefined ? String(filters.amount) : undefined,
      payment_type: filters.paymentType,
      payment_status: filters.paymentStatus,
      page: filters.page !== undefined ? String(filters.page) : undefined,
      page_size: filters.pageSize !== undefined ? String(filters.pageSize) : undefined,
    };

    const fieldOrder = [
      "req_time",
      "merchant_id",
      "from_date",
      "to_date",
      "amount",
      "payment_type",
      "payment_status",
      "page",
      "page_size",
    ] as const;

    const body: Record<string, string> = {
      req_time: reqTime,
      merchant_id: this.http.merchantId,
      hash: buildHash(hashFields, fieldOrder, this.http.apiKey),
    };

    for (const key of fieldOrder) {
      if (key === "req_time" || key === "merchant_id") continue;
      const value = hashFields[key];
      if (value !== undefined) body[key] = value;
    }

    const response = await this.http.request<TransactionListResponse>({
      path: API_PATHS.transactionList,
      body,
    });
    assertApiSuccess(response.status);
    return response;
  }

  /**
   * Fetch latest ABA Bank exchange rates.
   */
  async getExchangeRate(): Promise<ExchangeRateResponse> {
    const reqTime = formatRequestTime();
    const body = {
      req_time: reqTime,
      merchant_id: this.http.merchantId,
      hash: buildHash(
        { req_time: reqTime, merchant_id: this.http.merchantId },
        ["req_time", "merchant_id"],
        this.http.apiKey,
      ),
    };

    const response = await this.http.request<ExchangeRateResponse>({
      path: API_PATHS.exchangeRate,
      body,
    });
    assertApiSuccess(response.status);
    return response;
  }
}
