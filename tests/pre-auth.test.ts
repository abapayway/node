jest.mock("../src/utils/crypto", () => ({
  rsaEncrypt: jest.fn().mockReturnValue("mock_merchant_auth"),
}));

import { createTestClient, mockFetch } from "./helpers";
import preAuthMocks from "./mocks/pre-auth.json";

describe("PreAuthModule", () => {
  it("completes pre-auth capture", async () => {
    mockFetch((url) => {
      expect(url).toContain("pre-auth-completion");
      return preAuthMocks.complete;
    });

    const result = await createTestClient().preAuth.complete("00002894", { amount: 0.01 });
    expect(result.transaction_status).toBe("APPROVED");
  });

  it("cancels pre-auth", async () => {
    mockFetch((url) => {
      expect(url).toContain("pre-auth-cancellation");
      return preAuthMocks.cancel;
    });

    const result = await createTestClient().preAuth.cancel("00002894");
    expect(result.transaction_status).toBe("CANCELLED");
  });
});
