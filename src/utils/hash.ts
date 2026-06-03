import { createHmac } from "node:crypto";

/**
 * Generate a Base64-encoded HMAC-SHA512 signature.
 *
 * @param data - Concatenated string of request fields (in documented order)
 * @param apiKey - Merchant API key (public key)
 */
export function generateHash(data: string, apiKey: string): string {
  return createHmac("sha512", apiKey).update(data).digest("base64");
}

/**
 * Concatenate hash fields in the order specified by PayWay documentation.
 * Only fields with defined non-empty values are included.
 */
export function concatHashFields(
  values: Record<string, string | number | undefined>,
  fieldOrder: readonly string[],
): string {
  let result = "";
  for (const key of fieldOrder) {
    const value = values[key];
    if (value !== undefined && value !== "") {
      result += String(value);
    }
  }
  return result;
}

/**
 * Build hash from ordered fields and API key.
 */
export function buildHash(
  values: Record<string, string | number | undefined>,
  fieldOrder: readonly string[],
  apiKey: string,
): string {
  return generateHash(concatHashFields(values, fieldOrder), apiKey);
}

/**
 * Format current UTC time as YYYYMMDDHHmmss for `req_time` / `request_time`.
 */
export function formatRequestTime(date: Date = new Date()): string {
  const pad = (n: number, len = 2) => String(n).padStart(len, "0");
  return (
    `${date.getUTCFullYear()}` +
    `${pad(date.getUTCMonth() + 1)}` +
    `${pad(date.getUTCDate())}` +
    `${pad(date.getUTCHours())}` +
    `${pad(date.getUTCMinutes())}` +
    `${pad(date.getUTCSeconds())}`
  );
}
