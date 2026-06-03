# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `TokenType.CITU_FLEX`, `MITU_FLEX`, `MITR_FIX` and `SubscriptionFrequency` enum
- `tokenFlag` and `frequency` on checkout purchase for scheduled payments
- `preAuth.create()` wrapper for pre-authorization holds
- `credentials.chargeSubscription()` for MITR_FIX recurring charges
- Expanded QR API: full hash field order, `lifetime`, `qrImageTemplate`, typed response
- `QrPaymentOption`, `PurchaseType` enums

### Fixed

- Link card endpoint path (`/cof/link-card`) and multipart HTML response
- Link card hash field order per PayWay docs

## [0.1.0] - 2026-06-03

### Added

- Initial release of `@abapayway/node`
- `ABAPayWay` client with checkout, transaction, refund, webhook, credentials, QR, payment link, pre-auth, and payout modules
- HMAC-SHA512 request signing and webhook verification
- ESM + CJS dual builds via tsup
- Jest test suite with 80%+ coverage target
- Express and Next.js examples
