import { NextResponse } from "next/server";
import { ABAPayWay, Currency, PaymentOption } from "@abapayway/node";

const payway = new ABAPayWay({
  merchantId: process.env.PAYWAY_MERCHANT_ID!,
  apiKey: process.env.PAYWAY_API_KEY!,
  sandbox: process.env.PAYWAY_SANDBOX === "true",
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderId = `ORDER-${Date.now()}`;

    const checkout = await payway.checkout.create({
      orderId,
      amount: body.amount ?? 1,
      currency: Currency.USD,
      paymentOption: PaymentOption.ABAPAY,
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook`,
      firstName: body.firstName,
      lastName: body.lastName,
    });

    return new NextResponse(checkout.html, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
