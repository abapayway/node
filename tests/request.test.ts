import { resolveConfig } from "../src/config";
import { BASE_URL_SANDBOX } from "../src/constants";
import {
  ABAPayWayError,
  AuthenticationError,
  NetworkError,
  ValidationError,
} from "../src/utils/errors";
import { HttpClient } from "../src/utils/request";

describe("HttpClient", () => {
  const config = resolveConfig(
    { merchantId: "ec000002", apiKey: "test_key", sandbox: true },
    BASE_URL_SANDBOX,
  );
  const client = new HttpClient(config);

  it("throws ValidationError on 400", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 400,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({ error: "bad request" }),
    });

    await expect(client.request({ path: "/test", body: { a: "1" } })).rejects.toThrow(
      ValidationError,
    );
  });

  it("throws AuthenticationError on 401", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({}),
    });

    await expect(client.request({ path: "/test" })).rejects.toThrow(AuthenticationError);
  });

  it("throws ABAPayWayError on 500", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({}),
    });

    await expect(client.request({ path: "/test" })).rejects.toThrow(ABAPayWayError);
  });

  it("retries on network failure then succeeds", async () => {
    const fetchMock = jest
      .fn()
      .mockRejectedValueOnce(new TypeError("fetch failed"))
      .mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({ ok: true }),
      });
    global.fetch = fetchMock;

    const result = await client.request<{ ok: boolean }>({ path: "/test" });
    expect(result.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("sends multipart form data", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({}),
    });
    global.fetch = fetchMock;

    await client.request({
      path: "/multipart",
      contentType: "multipart",
      body: { field: "value" },
    });

    const body = fetchMock.mock.calls[0][1].body;
    expect(body).toBeInstanceOf(FormData);
  });
});
