import { generateHash } from "../src/utils/hash";
import { TEST_API_KEY, createTestClient } from "./helpers";

describe("WebhookModule", () => {
  it("verifies PayWay callback signatures", () => {
    const client = createTestClient();
    const payload = {
      tran_id: "17425401324",
      apv: "619195",
      status: "0",
      return_params: "order-1",
    };

    const sorted = Object.keys(payload).sort();
    let b4hash = "";
    for (const k of sorted) {
      b4hash += payload[k as keyof typeof payload];
    }

    const signature = generateHash(b4hash, TEST_API_KEY);
    expect(client.webhook.verify(payload, signature)).toBe(true);
  });

  it("rejects tampered payloads", () => {
    const client = createTestClient();
    expect(client.webhook.verify({ tran_id: "1" }, "bad")).toBe(false);
  });
});
