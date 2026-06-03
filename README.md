# @abapayway/node

[![npm version](https://img.shields.io/npm/v/@abapayway/node.svg)](https://www.npmjs.com/package/@abapayway/node)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/abapayway/node/actions/workflows/ci.yml/badge.svg)](https://github.com/abapayway/node/actions/workflows/ci.yml)

Unofficial Node.js/TypeScript SDK for [ABAPayWay](https://www.payway.com.kh/) — Cambodia's leading payment gateway by ABA Bank.

Zero runtime dependencies. Native `fetch` and Node.js `crypto` only.

## Install

```bash
npm install @abapayway/node
```

Requires **Node.js 18+**.

## Quick start

```typescript
import { ABAPayWay, Currency, PaymentOption } from "@abapayway/node";

const payway = new ABAPayWay({
  merchantId: process.env.PAYWAY_MERCHANT_ID!,
  apiKey: process.env.PAYWAY_API_KEY!,
  sandbox: true,
});

const orderId = `ORDER-${Date.now()}`;

// Create checkout (returns HTML to render)
const { html } = await payway.checkout.create({
  orderId,
  amount: 10.5,
  currency: Currency.USD,
  paymentOption: PaymentOption.ABAPAY,
  returnUrl: "https://yoursite.com/payment/return",
  cancelUrl: "https://yoursite.com/payment/cancel",
});

// Check payment status (within 7 days of creation)
const status = await payway.checkout.checkTransaction(orderId);
console.log(status.data.payment_status);
```

## Modules

| Module | Description |
|--------|-------------|
| `checkout` | Purchase, transaction details, close/check, list, exchange rates |
| `transaction` | Lookup by `merchant_ref` (KHQR) |
| `refund` | Full or partial refunds |
| `webhook` | HMAC-SHA512 signature verification |
| `credentials` | Link account/card, token payments, renew, remove |
| `qr` | Generate payment QR codes |
| `paymentLink` | Create and retrieve payment links |
| `preAuth` | Complete or cancel pre-authorizations |
| `payout` | Funds routing and beneficiary management |

## Webhook verification

```typescript
app.post("/webhook", express.json(), (req, res) => {
  const signature = req.headers["x-payway-hmac-sha512"] as string;

  if (!payway.webhook.verify(req.body, signature)) {
    return res.status(401).send("Invalid signature");
  }

  // Process { tran_id, status, apv, return_params }
  res.json({ ok: true });
});
```

## RSA-encrypted endpoints

Refund, pre-auth, payment link, and payout APIs require an RSA public key from PayWay:

```typescript
const payway = new ABAPayWay({
  merchantId: "...",
  apiKey: "...",
  rsaPublicKey: process.env.PAYWAY_RSA_PUBLIC_KEY!,
  sandbox: true,
});
```

## Environment URLs

| Environment | Base URL |
|-------------|----------|
| Sandbox | `https://checkout-sandbox.ababank.com` |
| Production | `https://checkout.payway.com.kh` |

## Examples

- [Node.js basic](./examples/node-basic/index.ts)
- [Express](./examples/express/index.ts)
- [Next.js App Router](./examples/nextjs/app/api/)

## Documentation

- [PayWay Developer Suite](https://developer.payway.com.kh/overview-865678m0)
- [API Endpoints](https://developer.payway.com.kh/api-endpoints-984508m0)
- [Ecommerce Checkout](https://developer.payway.com.kh/ecommerce-checkout-3158159f0)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](./LICENSE) — unofficial community SDK, not affiliated with ABA Bank.
