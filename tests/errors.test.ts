import { ABAPayWay } from "../src/client";
import { BASE_URL_PROD, BASE_URL_SANDBOX } from "../src/constants";
import { ABAPayWayError, AuthenticationError, NetworkError } from "../src/utils/errors";
import { buildHash, formatRequestTime, generateHash } from "../src/utils/hash";
import { TEST_API_KEY, createTestClient } from "./helpers";

describe("hash utilities", () => {
  it("generates deterministic base64 HMAC-SHA512", () => {
    const hash = generateHash("20250213065545ec00000217394277693", "secret_key");
    expect(typeof hash).toBe("string");
    expect(hash.length).toBeGreaterThan(0);
    expect(generateHash("20250213065545ec00000217394277693", "secret_key")).toBe(hash);
  });

  it("builds hash from ordered fields", () => {
    const hash = buildHash(
      { req_time: "20250212104216", merchant_id: "ec000002" },
      ["req_time", "merchant_id"],
      "api_key",
    );
    expect(hash).toBe(
      buildHash(
        { req_time: "20250212104216", merchant_id: "ec000002" },
        ["req_time", "merchant_id"],
        "api_key",
      ),
    );
  });

  it("formats request time as YYYYMMDDHHmmss UTC", () => {
    const time = formatRequestTime(new Date("2025-02-13T06:55:45.000Z"));
    expect(time).toBe("20250213065545");
  });
});

describe("ABAPayWay client environments", () => {
  it("uses sandbox base URL when sandbox is true", async () => {
    const client = createTestClient({ sandbox: true });
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        status: { code: "00", message: "Success" },
        exchange_rates: { usd: { buy: "1", sell: "1" } },
      }),
    });
    global.fetch = fetchMock;

    await client.checkout.getExchangeRate();
    expect(fetchMock.mock.calls[0][0]).toContain(BASE_URL_SANDBOX);
  });

  it("uses production base URL when sandbox is false", async () => {
    const client = createTestClient({ sandbox: false });
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        status: { code: "00", message: "Success" },
        exchange_rates: {},
      }),
    });
    global.fetch = fetchMock;

    await client.checkout.getExchangeRate();
    expect(fetchMock.mock.calls[0][0]).toContain(BASE_URL_PROD);
  });
});

describe("webhook verification", () => {
  const client = createTestClient();

  it("returns true for valid signature", () => {
    const payload = { tran_id: "17425401324", apv: "619195", status: "0" };
    const sortedKeys = Object.keys(payload).sort();
    let b4hash = "";
    for (const key of sortedKeys) {
      b4hash += String(payload[key as keyof typeof payload]);
    }
    const signature = generateHash(b4hash, TEST_API_KEY);
    expect(client.webhook.verify(payload, signature)).toBe(true);
  });

  it("returns false for invalid signature", () => {
    expect(client.webhook.verify({ tran_id: "1", status: "0" }, "invalid-signature")).toBe(false);
  });
});

describe("error classes", () => {
  it("exposes typed error properties", () => {
    const err = new AuthenticationError("Wrong hash", {
      code: "5",
      httpStatus: 403,
      raw: { status: { code: "5" } },
    });
    expect(err).toBeInstanceOf(ABAPayWayError);
    expect(err).toBeInstanceOf(AuthenticationError);
    expect(err.code).toBe("5");
    expect(err.httpStatus).toBe(403);
  });

  it("maps network failures to NetworkError", async () => {
    global.fetch = jest.fn().mockRejectedValue(new TypeError("fetch failed"));
    const client = createTestClient({ timeout: 100 });

    await expect(client.checkout.getExchangeRate()).rejects.toThrow(NetworkError);
  });
});
