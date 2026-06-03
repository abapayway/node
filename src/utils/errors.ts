/** Raw API response attached to errors */
export type RawResponse = unknown;

/**
 * Base error for all ABAPayWay SDK failures.
 */
export class ABAPayWayError extends Error {
  readonly code: string;
  readonly httpStatus?: number;
  readonly raw?: RawResponse;

  constructor(
    message: string,
    options: {
      code?: string;
      httpStatus?: number;
      raw?: RawResponse;
      cause?: Error;
    } = {},
  ) {
    super(message, { cause: options.cause });
    this.name = "ABAPayWayError";
    this.code = options.code ?? "UNKNOWN";
    this.httpStatus = options.httpStatus;
    this.raw = options.raw;
  }
}

/** Authentication or invalid hash failures */
export class AuthenticationError extends ABAPayWayError {
  constructor(message: string, options?: ConstructorParameters<typeof ABAPayWayError>[1]) {
    super(message, { ...options, code: options?.code ?? "AUTH_ERROR" });
    this.name = "AuthenticationError";
  }
}

/** Request validation failures */
export class ValidationError extends ABAPayWayError {
  constructor(message: string, options?: ConstructorParameters<typeof ABAPayWayError>[1]) {
    super(message, { ...options, code: options?.code ?? "VALIDATION_ERROR" });
    this.name = "ValidationError";
  }
}

/** Network or transport failures */
export class NetworkError extends ABAPayWayError {
  constructor(message: string, options?: ConstructorParameters<typeof ABAPayWayError>[1]) {
    super(message, { ...options, code: options?.code ?? "NETWORK_ERROR" });
    this.name = "NetworkError";
  }
}

/** Transaction-related API failures */
export class TransactionError extends ABAPayWayError {
  constructor(message: string, options?: ConstructorParameters<typeof ABAPayWayError>[1]) {
    super(message, { ...options, code: options?.code ?? "TRANSACTION_ERROR" });
    this.name = "TransactionError";
  }
}

/** Refund API failures */
export class RefundError extends ABAPayWayError {
  constructor(message: string, options?: ConstructorParameters<typeof ABAPayWayError>[1]) {
    super(message, { ...options, code: options?.code ?? "REFUND_ERROR" });
    this.name = "RefundError";
  }
}

/** Webhook verification failures */
export class WebhookError extends ABAPayWayError {
  constructor(message: string, options?: ConstructorParameters<typeof ABAPayWayError>[1]) {
    super(message, { ...options, code: options?.code ?? "WEBHOOK_ERROR" });
    this.name = "WebhookError";
  }
}

/** Credentials on file / token failures */
export class TokenError extends ABAPayWayError {
  constructor(message: string, options?: ConstructorParameters<typeof ABAPayWayError>[1]) {
    super(message, { ...options, code: options?.code ?? "TOKEN_ERROR" });
    this.name = "TokenError";
  }
}

/**
 * Map HTTP status and API status codes to typed errors.
 */
export function throwApiError(
  message: string,
  category: "transaction" | "refund" | "token" | "auth" | "validation",
  options?: { httpStatus?: number; code?: string; raw?: RawResponse },
): never {
  const ErrorClass = {
    transaction: TransactionError,
    refund: RefundError,
    token: TokenError,
    auth: AuthenticationError,
    validation: ValidationError,
  }[category];

  throw new ErrorClass(message, options);
}
