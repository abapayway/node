import { Currency } from "../src/types/common";
import { createTestClient, mockFetch } from "./helpers";
import qrMocks from "./mocks/qr.json";

describe("QrModule", () => {
  it("generates a payment QR code", async () => {
    mockFetch((url) => {
      expect(url).toContain("generate-qr");
      return qrMocks.generate;
    });

    const result = await createTestClient().qr.generate({
      amount: 1.5,
      currency: Currency.USD,
      orderId: "17536691884",
      merchantRef: "REF-001",
    });

    expect(result.data?.qr_string).toBeDefined();
  });
});
