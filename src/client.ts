import type { ABAPayWayConfig } from "./config.js";
import { resolveConfig } from "./config.js";
import { BASE_URL_PROD, BASE_URL_SANDBOX } from "./constants.js";
import { CheckoutModule } from "./modules/checkout.js";
import { CredentialsModule } from "./modules/credentials.js";
import { PaymentLinkModule } from "./modules/payment-link.js";
import { PayoutModule } from "./modules/payout.js";
import { PreAuthModule } from "./modules/pre-auth.js";
import { QrModule } from "./modules/qr.js";
import { RefundModule } from "./modules/refund.js";
import { TransactionModule } from "./modules/transaction.js";
import { WebhookModule } from "./modules/webhook.js";
import { HttpClient } from "./utils/request.js";

/**
 * Main ABAPayWay SDK client.
 *
 * @example
 * ```ts
 * const payway = new ABAPayWay({
 *   merchantId: "your_merchant_id",
 *   apiKey: "your_api_key",
 *   sandbox: true,
 * });
 *
 * const checkout = await payway.checkout.create({
 *   orderId: "ORDER-001",
 *   amount: 10.5,
 *   currency: Currency.USD,
 *   returnUrl: "https://example.com/return",
 * });
 * ```
 */
export class ABAPayWay {
  readonly checkout: CheckoutModule;
  readonly transaction: TransactionModule;
  readonly refund: RefundModule;
  readonly webhook: WebhookModule;
  readonly credentials: CredentialsModule;
  readonly qr: QrModule;
  readonly paymentLink: PaymentLinkModule;
  readonly preAuth: PreAuthModule;
  readonly payout: PayoutModule;

  private readonly http: HttpClient;

  constructor(config: ABAPayWayConfig) {
    const baseUrl = config.sandbox ? BASE_URL_SANDBOX : BASE_URL_PROD;
    const resolved = resolveConfig(config, baseUrl);
    this.http = new HttpClient(resolved);

    this.checkout = new CheckoutModule(this.http);
    this.transaction = new TransactionModule(this.http);
    this.refund = new RefundModule(this.http);
    this.webhook = new WebhookModule(resolved.apiKey);
    this.credentials = new CredentialsModule(this.http, this.checkout);
    this.qr = new QrModule(this.http);
    this.paymentLink = new PaymentLinkModule(this.http);
    this.preAuth = new PreAuthModule(this.http, this.checkout);
    this.payout = new PayoutModule(this.http);
  }
}
