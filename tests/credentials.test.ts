import { Currency, TokenType } from "../src/types/common";
import { createTestClient, mockFetch } from "./helpers";
import credentialsMocks from "./mocks/credentials.json";

describe("CredentialsModule", () => {
  it("links an ABA account", async () => {
    mockFetch((url) => {
      expect(url).toContain("link-account");
      return credentialsMocks.linkAccount;
    });

    const result = await createTestClient().credentials.linkAccount({
      ctid: "customer001",
      requestId: "req001",
      tokenFlag: TokenType.CITI_FLEX,
      currency: Currency.USD,
    });

    expect(result.data.qr_string).toBeDefined();
  });

  it("links a card", async () => {
    mockFetch(() => credentialsMocks.linkCard);
    const result = await createTestClient().credentials.linkCard({
      ctid: "customer001",
      requestId: "req002",
      tokenFlag: TokenType.CITO_FLEX,
      currency: Currency.USD,
    });
    expect(result.data.html).toContain("form");
  });

  it("processes token payment", async () => {
    mockFetch(() => credentialsMocks.payment);
    const result = await createTestClient().credentials.payment("tok_123", {
      amount: 10,
      currency: Currency.USD,
      orderId: "order-1",
      tokenType: TokenType.CITR_FIX,
    });
    expect(result.status.code).toBe("00");
  });

  it("renews a token", async () => {
    mockFetch(() => credentialsMocks.renewToken);
    const result = await createTestClient().credentials.renewToken("tok_123");
    expect(result.status.code).toBe("00");
  });

  it("gets token details", async () => {
    mockFetch(() => credentialsMocks.getTokenDetails);
    const result = await createTestClient().credentials.getTokenDetails("tok_123");
    expect(result.data?.masked_account).toBe("****1234");
  });

  it("removes a token", async () => {
    mockFetch(() => credentialsMocks.removeToken);
    const result = await createTestClient().credentials.removeToken("tok_123");
    expect(result.status.code).toBe("00");
  });
});
