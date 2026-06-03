import { ABAPayWay } from "../src/client";
import type { ABAPayWayConfig } from "../src/config";
import { BASE_URL_SANDBOX } from "../src/constants";

export const TEST_API_KEY = "test_api_key_12345678901234567890123456789012";
export const TEST_MERCHANT_ID = "ec000002";

export function createTestClient(overrides: Partial<ABAPayWayConfig> = {}): ABAPayWay {
  return new ABAPayWay({
    merchantId: TEST_MERCHANT_ID,
    apiKey: TEST_API_KEY,
    sandbox: true,
    rsaPublicKey: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0Z3VS5JJcds3xfn/ygW
gE8fHdLyfW8qJ8xKqJ8xKqJ8xKqJ8xKqJ8xKqJ8xKqJ8xKqJ8xKqJ8xKqJ8xKq
J8xKqJ8xKqJ8xKqJ8xKqJ8xKqJ8xKqJ8xKqJ8xKqJ8xKqJ8xKqJ8xKqJ8xKqJ8
xKqJ8xKqJ8xKqJ8xKqJ8xKqJ8xKqJ8xKqJ8xKqJ8xKqJ8xKqJ8xKqJ8xKqJ8x
KqJ8xKqJ8xKqJ8xKqJ8xKqJ8xKqJ8xKqJ8xKqJ8xKqJ8xKqJ8xKqJ8xKqJ8x
KqJ8xKqJ8xKqJ8xKqJ8xKqJ8xKqJ8xKqJ8xKqJ8xKqJ8xKqJ8xKqJ8xKqJ8
QIDAQAB
-----END PUBLIC KEY-----`,
    ...overrides,
  });
}

export function mockFetch(handler: (url: string, init?: RequestInit) => unknown): void {
  global.fetch = jest.fn(async (input: string | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input.toString();
    const result = handler(url, init);

    if (typeof result === "string") {
      return {
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "text/html" }),
        text: async () => result,
        json: async () => JSON.parse(result),
      } as Response;
    }

    const body = JSON.stringify(result);
    return {
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      text: async () => body,
      json: async () => result,
    } as Response;
  }) as typeof fetch;
}

export function expectSandboxUrl(url: string): void {
  expect(url.startsWith(BASE_URL_SANDBOX)).toBe(true);
}
