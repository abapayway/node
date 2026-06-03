jest.mock("../src/utils/crypto", () => ({
  rsaEncrypt: jest.fn().mockReturnValue("mock_merchant_auth"),
}));

import { ValidationError } from "../src/utils/errors";
import { createTestClient, mockFetch } from "./helpers";
import refundMocks from "./mocks/refund.json";

describe("RefundModule", () => {
  it("creates a partial refund", async () => {
    mockFetch((url) => {
      expect(url).toContain("/refund");
      return refundMocks.create;
    });

    const result = await createTestClient().refund.create("00002894", { amount: 0.01 });
    expect(result.transaction_status).toBe("REFUNDED");
  });

  it("requires rsaPublicKey", async () => {
    await expect(
      createTestClient({ rsaPublicKey: undefined }).refund.create("00002894"),
    ).rejects.toThrow(ValidationError);
  });
});
