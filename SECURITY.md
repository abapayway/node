# Security — @abapayway/node

## Network access (Socket / supply-chain scanners)

This package **intentionally uses the network**. It is a server-side HTTP client for the [ABAPayWay](https://www.payway.com.kh/) payment gateway.

| Item | Detail |
|------|--------|
| Mechanism | Node.js native `fetch` (via `globalThis.fetch`) |
| Location | `src/utils/request.ts` → compiled to `dist/index.js` / `dist/index.cjs` |
| Purpose | HTTPS requests to PayWay checkout APIs only |
| Destinations | Host configured at init: `checkout.payway.com.kh` or sandbox equivalent (see `baseUrl`) |
| When | Only when you call SDK methods (e.g. `checkout.create`, `refund.create`) |

There is **no** background networking, telemetry, analytics, or calls to third-party hosts other than the PayWay base URL you configure.

### Why scanners flag this

Tools such as [Socket](https://socket.dev) report **Network access** as a *capability*, not a vulnerability. Score impact on “Supply Chain Security” is informational: consumers should confirm network use is legitimate.

For this SDK, network access is **required** and cannot be removed without breaking all payment functionality.

### What you should audit

1. **Base URL** — Use `sandbox: true` in non-production; override with `baseUrl` only when needed.
2. **Secrets** — Keep `apiKey` and `rsaPublicKey` on the server; never bundle in client-side code.
3. **Webhooks** — Verify `X-PAYWAY-HMAC-SHA512` with `payway.webhook.verify()` before trusting callbacks.
4. **Whitelist** — PayWay only accepts requests from whitelisted domains/IPs (their policy, not SDK-enforced).

### Reporting vulnerabilities

If you find a security issue in this SDK (not PayWay’s API itself), please open a private issue or contact the maintainers via [GitHub](https://github.com/abapayway/node/security).

For PayWay platform security, contact ABA Bank / PayWay integration support.
