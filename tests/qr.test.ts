import { Currency, QrPaymentOption } from "../src/types/common";
import { createTestClient, mockFetch } from "./helpers";
import qrMocks from "./mocks/qr.json";

describe("QrModule", () => {
  it("generates a payment QR code", async () => {
    mockFetch((url) => {
      expect(url).toContain("generate-qr");
      return qrMocks.generate;
    });

    const result = await createTestClient().qr.generate({
      amount: 0.01,
      currency: Currency.USD,
      orderId: "20250311033231",
      paymentOption: QrPaymentOption.ABAPAY_KHQR,
      lifetime: 6,
      qrImageTemplate: "template3_color",
    });

    expect(result.qrString).toBeDefined();
    expect(result.qrImage).toContain("base64");
  });
});
