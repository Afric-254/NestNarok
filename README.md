# NarokNest

NarokNest is a Next.js booking prototype for stays in Narok Town, Kenya. It uses Node's built-in SQLite database for stay records and booking/payment state, and Pesapal hosted checkout for Visa and M-Pesa.

## Run locally

Requirements: Node.js 22.5 or newer.

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

The database is created and seeded in `.data/naroknest.sqlite` on first server request. Set `DATABASE_PATH` to a persistent writable location when deploying. SQLite files are not suitable for ephemeral/serverless filesystems or multi-instance deployments; use a shared production database before scaling.

To enable the initial administrator account, set `ADMIN_EMAIL` and a unique `ADMIN_PASSWORD` of at least 12 characters in `.env.local` before the first login or signup request. The account is created server-side the first time the auth API runs. Admin credentials are never exposed to the browser. Do not reuse these sample values for production.

## API

- `GET /api/stays` — list stays.
- `GET /api/stays/:slug` — get a stay.
- `POST /api/bookings` — validate dates, guest details and price on the server, then persist a booking request.
- `POST /api/auth/signup` and `POST /api/auth/login` — create accounts and establish an HTTP-only session cookie.
- `POST /api/auth/logout` — revoke the current session.
- `GET /api/auth/me` — return the current authenticated account.
- `POST /api/admin/hosts/:id/approve` — admin-only approval of a host application.
- `POST /api/admin/assignments` — admin-only assignment of an unowned listing to an approved host.
- `POST /api/payments/pesapal` — create a Pesapal hosted checkout for an existing booking.
- `GET /api/payments/pesapal/ipn` — Pesapal IPN callback. The server queries Pesapal before updating payment state.
- `GET /api/payments/pesapal/status?orderTrackingId=...` — verify a payment with Pesapal.

Booking request JSON:

```json
{
  "staySlug": "maasai-sunset-lodge",
  "checkin": "2026-12-20",
  "checkout": "2026-12-23",
  "guests": 2,
  "guestName": "Guest Name",
  "guestEmail": "guest@example.com",
  "guestPhone": "0712345678"
}
```

## Pesapal production setup

1. Complete Pesapal merchant onboarding and obtain explicit approval for the NarokNest business model, settlement route, and the payment methods you intend to offer. Visa/M-Pesa availability is controlled by Pesapal and the merchant account; the app cannot turn methods on itself.
2. Deploy the Node.js app on a persistent, single-instance host with a public HTTPS domain. Configure a durable `DATABASE_PATH`, `APP_BASE_URL` as the origin only (for example `https://bookings.example.co.ke`, with no path), and the server-side credentials in the hosting provider's encrypted environment/secrets settings.
3. Set `PESAPAL_ENV=live`, `PESAPAL_CONSUMER_KEY`, and `PESAPAL_CONSUMER_SECRET` to the live merchant credentials. Never use `NEXT_PUBLIC_` names, check them into source control, paste them into support chats, or expose them in browser code or logs.
4. Register the notification URL `https://your-domain/api/payments/pesapal/ipn` with the **live** Pesapal account. Set the returned ID in `PESAPAL_IPN_ID`. Sandbox and live IPN IDs are different; never mix credentials and IDs between environments. If the variable is omitted, the app registers the notification URL on demand and caches its ID only for the lifetime of that server process. Production deployments should configure the ID explicitly.
5. Configure the callback/redirect URL as `https://your-domain/payment/return` if required by your merchant setup. Allow Pesapal callbacks through the deployment's proxy/WAF and verify the app remains reachable from the public internet.
6. Before serving real customers, complete a low-value live transaction with written provider approval, confirm Visa and M-Pesa are offered on the hosted checkout, verify the callback and server-side status lookup, and exercise cancellation, timeouts, duplicate callbacks, refunds, and reconciliation. Monitor failed checkout/status requests and have a support/refund process.

Development uses `PESAPAL_ENV=sandbox` and sandbox credentials with a public HTTPS tunnel URL; Pesapal cannot reach `localhost`. Live mode requires an explicit `PESAPAL_ENV=live`, complete server configuration, a public HTTPS production origin, and valid approved credentials. In production the app does not silently fall back to sandbox when `PESAPAL_ENV` is omitted. The admin dashboard shows a configuration-presence check only; it cannot verify merchant approval, available payment methods, or settlement setup.

The browser is redirected to Pesapal-hosted checkout; payment credentials and card details do not pass through NarokNest. Booking payment status is updated only after the server queries Pesapal. Checkout fails closed when configuration is missing or invalid. No Stripe integration is included: Pesapal is the selected gateway for both Visa and M-Pesa; adding Stripe would be a separate card-payment route and would not implement M-Pesa.

## Host commission and payouts

The current sample policy calculates a 10% commission against the accommodation subtotal (nightly price × nights), excluding the cleaning fee. The booking database stores that figure and an illustrative host amount. These are calculations for product display and reconciliation only; they are not evidence that NarokNest received, segregated, holds, or can pay those funds. Any commission, deductions, cleaning-fee allocation, refund/chargeback handling, and payout timing must be set in a signed host agreement and reflected accurately in guest disclosures before launch.

The code does **not** split a payment, deduct/transfer a commission at settlement, or send host money to M-Pesa. Pesapal checkout settles under the merchant arrangement it has approved. Do not advertise a personal M-Pesa number as a marketplace collection account or route customer/host money through a personal wallet unless Pesapal/Safaricom and Kenyan legal/accounting advisers confirm that the specific business arrangement is permitted. A future payout feature requires an approved business merchant/settlement account, verified recipients, a provider-supported payout product, reconciliation, refund/chargeback procedures, and a secure server-side integration. Keep account identifiers and credentials in provider-managed or encrypted server configuration, not this repository.

The `/host` page describes the commission as a proposal and now distinguishes payment collection from host payout. It is general information, not Kenyan legal, tax, or financial advice. Before live transactions, obtain advice on payment-provider and regulatory requirements, agency/merchant responsibilities, host contracts, Kenyan tax/invoicing, receipts, refunds/chargebacks, consumer disclosures, and data-protection obligations.

## Image delivery

Property, hero, and experience photography uses `next/image` with responsive sizes and the `images.unsplash.com` remote host allowlisted in `next.config.ts`. The Next.js image optimizer negotiates AVIF/WebP where supported. Use licensed images from an approved image host; for a new remote domain, add its exact HTTPS hostname to `images.remotePatterns` rather than allowing arbitrary remote images.

## Current scope and production notes

- Sign-up/login now uses SQLite-backed accounts, scrypt password hashes, random opaque session tokens stored as hashes, and HTTP-only cookies. Guest registration cannot grant host or admin privileges. Host applications require admin approval.
- `/dashboard` provides admin booking/commission summaries, host-application approval and listing assignment, plus a host view limited to assigned listings and their bookings. Guest booking history is not yet connected to guest accounts.
- Admins can be bootstrapped using `ADMIN_EMAIL` and `ADMIN_PASSWORD`. If that email already belongs to a non-admin, configure a different admin email; the app does not silently elevate an existing account.
- This remains a starter backend, not yet a production reservation system: add email verification and password reset, abuse/rate limiting, monitoring, automated cleanup/reconciliation, privacy controls, backups, listing management, and host-side availability management before taking live bookings.
- Review the deployment's trusted proxy and HTTPS configuration. Session cookies are marked secure in production, and state-changing authentication/admin endpoints reject requests whose `Origin` host differs from the request host.
- The SQLite backend requires a persistent single-instance Node.js deployment. Migrate to a managed shared database before using multiple application instances.
