import express from "express";
import { ABAPayWay, Currency, PaymentOption } from "@abapayway/node";

const app = express();
app.use(express.json());

const payway = new ABAPayWay({
  merchantId: process.env.PAYWAY_MERCHANT_ID ?? "your_merchant_id",
  apiKey: process.env.PAYWAY_API_KEY ?? "your_api_key",
  sandbox: true,
});

app.post("/pay", async (req, res) => {
  try {
    const orderId = `ORDER-${Date.now()}`;
    const checkout = await payway.checkout.create({
      orderId,
      amount: req.body.amount ?? 1,
      currency: Currency.USD,
      paymentOption: PaymentOption.CARDS,
      returnUrl: `${req.protocol}://${req.get("host")}/webhook`,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
    });

    res.type("html").send(checkout.html);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.post("/webhook", (req, res) => {
  const signature = req.headers["x-payway-hmac-sha512"] as string | undefined;

  if (!signature || !payway.webhook.verify(req.body, signature)) {
    return res.status(401).send("Invalid signature");
  }

  const { tran_id, status, apv } = req.body;
  console.log("Payment callback:", { tran_id, status, apv });

  res.json({ received: true });
});

const port = process.env.PORT ?? 3000;
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
