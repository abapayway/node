import { ABAPayWay, Currency, PaymentOption } from "@abapayway/node";

async function main() {
  const payway = new ABAPayWay({
    merchantId: process.env.PAYWAY_MERCHANT_ID ?? "your_merchant_id",
    apiKey: process.env.PAYWAY_API_KEY ?? "your_api_key",
    sandbox: true,
  });

  const orderId = `ORDER-${Date.now()}`;

  const checkout = await payway.checkout.create({
    orderId,
    amount: 0.1,
    currency: Currency.USD,
    paymentOption: PaymentOption.ABAPAY,
    returnUrl: "https://example.com/payment/return",
    cancelUrl: "https://example.com/payment/cancel",
    firstName: "John",
    lastName: "Doe",
    phone: "012345678",
  });

  console.log("Checkout HTML length:", checkout.html.length);

  const status = await payway.checkout.checkTransaction(orderId);
  console.log("Payment status:", status.data.payment_status);
}

main().catch(console.error);
