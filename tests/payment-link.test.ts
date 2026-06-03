jest.mock("../src/utils/crypto", () => ({
  rsaEncrypt: jest.fn().mockReturnValue("mock_merchant_auth"),
}));

import { Currency } from "../src/types/common";
import { ValidationError } from "../src/utils/errors";
import { createTestClient, mockFetch } from "./helpers";
import paymentLinkMocks from "./mocks/payment-link.json";

describe("PaymentLinkModule", () => {
  it("creates a payment link", async () => {
    mockFetch((url) => {
      expect(url).toContain("payment-link/create");
      return paymentLinkMocks.create;
    });

    const result = await createTestClient().paymentLink.create({
      title: "Test",
      amount: 0.03,
      currency: Currency.USD,
      expiredDate: Date.now(),
      returnUrl: "https://example.com/callback",
    });

    expect(result.data.payment_link).toContain("pl_123");
  });

  it("gets payment link details", async () => {
    mockFetch(() => paymentLinkMocks.get);
    const result = await createTestClient().paymentLink.get("pl_123");
    expect(result.data.id).toBe("pl_123");
  });

  it("requires rsaPublicKey for create", async () => {
    await expect(
      createTestClient({ rsaPublicKey: undefined }).paymentLink.create({
        title: "T",
        amount: 1,
        currency: Currency.USD,
        expiredDate: 1,
        returnUrl: "https://example.com",
      }),
    ).rejects.toThrow(ValidationError);
  });
});
