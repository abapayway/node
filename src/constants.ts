/** Sandbox checkout base URL */
export const BASE_URL_SANDBOX = "https://checkout-sandbox.ababank.com";

/** Production checkout base URL */
export const BASE_URL_PROD = "https://checkout.payway.com.kh";

/** Default request timeout in milliseconds */
export const DEFAULT_TIMEOUT_MS = 30_000;

/** Maximum network retry attempts */
export const MAX_RETRIES = 2;

/** API path prefixes */
export const API_PATHS = {
  purchase: "/api/payment-gateway/v1/payments/purchase",
  transactionDetail: "/api/payment-gateway/v1/payments/transaction-detail",
  closeTransaction: "/api/payment-gateway/v1/payments/close-transaction",
  checkTransaction: "/api/payment-gateway/v1/payments/check-transaction",
  transactionList: "/api/payment-gateway/v1/payments/transaction-list",
  exchangeRate: "/api/payment-gateway/v1/exchange-rate",
  getTransactionsByMcRef: "/api/payment-gateway/v1/payments/get-transactions-by-mc-ref",
  refund: "/api/merchant-portal/merchant-access/online-transaction/refund",
  preAuthCompletion: "/api/merchant-portal/merchant-access/online-transaction/pre-auth-completion",
  preAuthCompletionWithPayout:
    "/api/merchant-portal/merchant-access/online-transaction/pre-auth-completion-with-payout",
  preAuthCancellation:
    "/api/merchant-portal/merchant-access/online-transaction/pre-auth-cancellation",
  linkAccount: "/api/payment-credential/v3/aof/link-account",
  linkCard: "/api/payment-credential/v3/cof/link-card",
  cofPayment: "/api/payment-credential/v3/aof/payment",
  renewToken: "/api/payment-credential/v3/aof/renew-token",
  getTokenDetails: "/api/payment-credential/v3/aof/get-token-details",
  removeToken: "/api/payment-gateway/v1/cof/remove",
  cofInitial: "/api/payment-gateway/v1/cof/initial",
  cofSubscribe: "/api/payment-gateway/v1/payments/purchase",
  qrGenerate: "/api/payment-gateway/v1/payments/generate-qr",
  paymentLinkCreate: "/api/merchant-portal/merchant-access/payment-link/create",
  paymentLinkGet: "/api/merchant-portal/merchant-access/payment-link/details",
  payout: "/api/payment-gateway/v2/direct-payment/merchant/payout",
  payoutBeneficiaryStatus: "/api/payment-gateway/v2/direct-payment/merchant/beneficiary/status",
  payoutWhitelist: "/api/payment-gateway/v2/direct-payment/merchant/beneficiary/whitelist",
} as const;

/** Purchase API hash field order (only included fields are concatenated) */
export const PURCHASE_HASH_FIELDS = [
  "req_time",
  "merchant_id",
  "tran_id",
  "amount",
  "items",
  "shipping",
  "firstname",
  "lastname",
  "email",
  "phone",
  "type",
  "payment_option",
  "return_url",
  "cancel_url",
  "continue_success_url",
  "return_deeplink",
  "currency",
  "custom_fields",
  "return_params",
  "payout",
  "lifetime",
  "additional_params",
  "google_pay_token",
  "skip_success_page",
  "ctid",
  "token_flag",
  "frequency",
] as const;

/** Link card API hash field order */
export const LINK_CARD_HASH_FIELDS = [
  "merchant_id",
  "request_time",
  "ctid",
  "callback_url",
  "request_id",
  "token_flag",
  "frequency",
  "amount",
  "currency",
  "continue_success_url",
] as const;

/** QR generate API hash field order */
export const QR_HASH_FIELDS = [
  "req_time",
  "merchant_id",
  "tran_id",
  "amount",
  "items",
  "first_name",
  "last_name",
  "email",
  "phone",
  "purchase_type",
  "payment_option",
  "callback_url",
  "return_deeplink",
  "currency",
  "custom_fields",
  "return_params",
  "payout",
  "lifetime",
  "qr_image_template",
] as const;

/** Credentials subscription (purchase + token) hash fields */
export const SUBSCRIBE_HASH_FIELDS = [
  "req_time",
  "merchant_id",
  "tran_id",
  "amount",
  "ctid",
  "token_flag",
  "frequency",
  "currency",
  "return_url",
  "items",
  "payment_option",
  "firstname",
  "lastname",
  "email",
  "phone",
] as const;
