/**
 * Configuration for the ABAPayWay client.
 */
export interface ABAPayWayConfig {
  /** Merchant ID provided by ABA Bank / PayWay */
  merchantId: string;
  /** API key (public key) used for HMAC-SHA512 signing */
  apiKey: string;
  /** Use sandbox environment when true (default: false) */
  sandbox?: boolean;
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
  /**
   * RSA public key (PEM) for endpoints that require `merchant_auth` encryption
   * (refund, pre-auth, payment link). Optional unless using those modules.
   */
  rsaPublicKey?: string;
  /** Custom base URL override (advanced) */
  baseUrl?: string;
}

/**
 * Resolved internal configuration with defaults applied.
 */
export interface ResolvedConfig {
  merchantId: string;
  apiKey: string;
  sandbox: boolean;
  timeout: number;
  rsaPublicKey?: string;
  baseUrl: string;
}

/**
 * Apply defaults to user-supplied configuration.
 */
export function resolveConfig(config: ABAPayWayConfig, defaultBaseUrl: string): ResolvedConfig {
  return {
    merchantId: config.merchantId,
    apiKey: config.apiKey,
    sandbox: config.sandbox ?? false,
    timeout: config.timeout ?? 30_000,
    rsaPublicKey: config.rsaPublicKey,
    baseUrl: config.baseUrl ?? defaultBaseUrl,
  };
}
