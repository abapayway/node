import { WebhookError } from "../utils/errors.js";
import { generateHash } from "../utils/hash.js";

/**
 * Webhook signature verification utilities.
 */
export class WebhookModule {
  constructor(private readonly apiKey: string) {}

  /**
   * Verify HMAC-SHA512 webhook signature from PayWay callback.
   *
   * PayWay sorts payload keys ascending, concatenates all values (arrays as JSON),
   * then signs with HMAC-SHA512. Compare against `X-PAYWAY-HMAC-SHA512` header value.
   */
  verify(payload: Record<string, unknown>, signature: string): boolean {
    try {
      const sortedKeys = Object.keys(payload).sort();
      let b4hash = "";

      for (const key of sortedKeys) {
        let value = payload[key];
        if (Array.isArray(value)) {
          value = JSON.stringify(value);
        }
        if (value !== null && value !== undefined) {
          b4hash += String(value);
        }
      }

      const expected = generateHash(b4hash, this.apiKey);

      if (expected.length !== signature.length) {
        return false;
      }

      let mismatch = 0;
      for (let i = 0; i < expected.length; i++) {
        mismatch |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
      }
      return mismatch === 0;
    } catch {
      throw new WebhookError("Failed to verify webhook signature");
    }
  }
}
