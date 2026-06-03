import { Currency, PaymentOption } from "../src/types/common";
import { ABAPayWayError } from "../src/utils/errors";
import { createTestClient, expectSandboxUrl, mockFetch } from "./helpers";
import checkoutMocks from "./mocks/checkout.json";

describe("CheckoutModule", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("creates checkout and returns HTML", async () => {
    mockFetch((url) => {
      expectSandboxUrl(url);
      if (url.includes("/purchase")) return checkoutMocks.html;
      return {};
    });

    const client = createTestClient();
    const result = await client.checkout.create({
      orderId: "17536691884",
      amount: 0.1,
      currency: Currency.USD,
      paymentOption: PaymentOption.ABAPAY,
      returnUrl: "https://example.com/return",
    });

    expect(result.html).toContain("PayWay");
  });

  it("gets transaction details", async () => {
    mockFetch((url) => {
      if (url.includes("transaction-detail")) return checkoutMocks.transactionDetail;
      return {};
    });

    const client = createTestClient();
    const result = await client.checkout.getTransaction("17394277693");
    expect(result.data.payment_status).toBe("APPROVED");
  });

  it("checks transaction status", async () => {
    mockFetch(() => checkoutMocks.checkTransaction);
    const result = await createTestClient().checkout.checkTransaction("17394277693");
    expect(result.data.payment_status_code).toBe(0);
  });

  it("closes a transaction", async () => {
    mockFetch(() => checkoutMocks.closeTransaction);
    const result = await createTestClient().checkout.closeTransaction("17394277693");
    expect(result.status.code).toBe("00");
  });

  it("lists transactions", async () => {
    mockFetch(() => checkoutMocks.transactionList);
    const result = await createTestClient().checkout.getTransactionList({
      fromDate: "20250201",
      toDate: "20250213",
    });
    expect(result.data).toHaveLength(1);
  });

  it("fetches exchange rates", async () => {
    mockFetch(() => checkoutMocks.exchangeRate);
    const result = await createTestClient().checkout.getExchangeRate();
    expect(result.exchange_rates.usd).toBeDefined();
  });

  it("throws on API error status", async () => {
    mockFetch(() => ({
      status: { code: "6", message: "Transaction not found" },
    }));

    await expect(createTestClient().checkout.getTransaction("missing")).rejects.toThrow(
      ABAPayWayError,
    );
  });
});
