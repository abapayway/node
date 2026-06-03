import type { ResolvedConfig } from "../config.js";
import { MAX_RETRIES } from "../constants.js";
import { ABAPayWayError, AuthenticationError, NetworkError, ValidationError } from "./errors.js";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestOptions {
  path: string;
  method?: HttpMethod;
  body?: Record<string, string | number | undefined> | FormData;
  headers?: Record<string, string>;
  contentType?: "json" | "form" | "multipart";
  /** Skip JSON parse and return raw text (e.g. purchase HTML) */
  rawResponse?: boolean;
}

export interface ApiStatus {
  code: string | number;
  message: string;
  tran_id?: string;
  trace_id?: string;
}

function isNetworkError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const msg = error.message.toLowerCase();
  return (
    error.name === "AbortError" ||
    msg.includes("fetch failed") ||
    msg.includes("network") ||
    msg.includes("econnreset") ||
    msg.includes("etimedout")
  );
}

function mapHttpError(status: number, raw: unknown): ABAPayWayError {
  if (status === 401 || status === 403) {
    return new AuthenticationError(`HTTP ${status}: authentication failed`, {
      httpStatus: status,
      raw,
      code: String(status),
    });
  }
  if (status === 400 || status === 422) {
    return new ValidationError(`HTTP ${status}: validation failed`, {
      httpStatus: status,
      raw,
      code: String(status),
    });
  }
  return new ABAPayWayError(`HTTP ${status}: request failed`, {
    httpStatus: status,
    raw,
    code: String(status),
  });
}

/**
 * HTTP client for PayWay API with retries and timeout.
 */
export class HttpClient {
  constructor(private readonly config: ResolvedConfig) {}

  get baseUrl(): string {
    return this.config.baseUrl;
  }

  get merchantId(): string {
    return this.config.merchantId;
  }

  get apiKey(): string {
    return this.config.apiKey;
  }

  get rsaPublicKey(): string | undefined {
    return this.config.rsaPublicKey;
  }

  /**
   * Execute an HTTP request against the PayWay API.
   */
  async request<T>(options: RequestOptions): Promise<T> {
    const url = `${this.config.baseUrl.replace(/\/$/, "")}${options.path}`;
    const method = options.method ?? "POST";
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      try {
        const { headers, body } = this.buildBody(options);
        const response = await fetch(url, {
          method,
          headers,
          body,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (options.rawResponse) {
          const text = await response.text();
          if (!response.ok) {
            throw mapHttpError(response.status, text);
          }
          return text as T;
        }

        const contentType = response.headers.get("content-type") ?? "";
        const raw: unknown = contentType.includes("application/json")
          ? await response.json()
          : await response.text();

        if (!response.ok) {
          throw mapHttpError(response.status, raw);
        }

        return raw as T;
      } catch (error) {
        clearTimeout(timeoutId);

        if (error instanceof ABAPayWayError) {
          throw error;
        }

        if (isNetworkError(error) && attempt < MAX_RETRIES) {
          lastError = error instanceof Error ? error : new Error(String(error));
          continue;
        }

        if (isNetworkError(error)) {
          throw new NetworkError(
            error instanceof Error ? error.message : "Network request failed",
            { cause: error instanceof Error ? error : undefined },
          );
        }

        throw error;
      }
    }

    throw new NetworkError(lastError?.message ?? "Network request failed", {
      cause: lastError,
    });
  }

  private buildBody(options: RequestOptions): {
    headers: Record<string, string>;
    body: FormData | string | undefined;
  } {
    const headers: Record<string, string> = { ...options.headers };

    if (!options.body) {
      return { headers, body: undefined };
    }

    if (options.body instanceof FormData) {
      return { headers, body: options.body };
    }

    const contentType = options.contentType ?? "json";

    if (contentType === "form") {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(options.body)) {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      }
      headers["Content-Type"] = "application/x-www-form-urlencoded";
      return { headers, body: params.toString() };
    }

    if (contentType === "multipart") {
      const form = new FormData();
      for (const [key, value] of Object.entries(options.body)) {
        if (value !== undefined) {
          form.append(key, String(value));
        }
      }
      return { headers, body: form };
    }

    headers["Content-Type"] = "application/json";
    return { headers, body: JSON.stringify(options.body) };
  }
}

/**
 * Check PayWay status object and throw if not success.
 */
export function assertApiSuccess(
  status: ApiStatus | undefined,
  message = "API request failed",
): void {
  if (!status) return;

  const code = String(status.code);
  const successCodes = new Set(["00", "0", "PTL00"]);

  if (!successCodes.has(code)) {
    if (code === "5" || code === "1" || code === "01" || code === "PTL02") {
      throw new AuthenticationError(status.message || message, {
        code,
        raw: status,
      });
    }
    throw new ABAPayWayError(status.message || message, { code, raw: status });
  }
}
