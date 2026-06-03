import { NextResponse } from "next/server";
import { ABAPayWay } from "@abapayway/node";

const payway = new ABAPayWay({
  merchantId: process.env.PAYWAY_MERCHANT_ID!,
  apiKey: process.env.PAYWAY_API_KEY!,
  sandbox: process.env.PAYWAY_SANDBOX === "true",
});

export async function POST(request: Request) {
  const signature = request.headers.get("x-payway-hmac-sha512");
  const payload = await request.json();

  if (!signature || !payway.webhook.verify(payload, signature)) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  console.log("PayWay webhook:", payload);
  return NextResponse.json({ ok: true });
}
