## 2026-03-30 - Production Webhook Verification Fail-Closed Pattern
**Vulnerability:** Missing `CALCOM_WEBHOOK_SECRET` in environment variables permitted unauthenticated Cal.com webhook requests in production, bypassing HMAC SHA-256 signature checks and enabling webhook spoofing.
**Learning:** Webhook HMAC verification fallbacks intended for local development must explicitly check `process.env.NODE_ENV !== 'production'`. When running in production, missing webhook secret configuration must fail securely and reject incoming payloads.
**Prevention:** Enforce fail-closed security behavior for all external webhook HMAC verification functions in production.

## 2026-03-30 - ERPNext REST API Filter Injection Prevention
**Vulnerability:** Raw string interpolation of untrusted input (e.g. `slug`, `poleSlug`, `cleanEmail`) into ERPNext REST API `filters` URL query parameter allowed filter syntax injection and query manipulation.
**Learning:** In Frappe / ERPNext REST API endpoints (`/api/resource/<DocType>?filters=...`), query filters should be constructed as JavaScript arrays, serialized via `JSON.stringify()`, and encoded using `encodeURIComponent()`.
**Prevention:** Avoid template literals for JSON filter parameters in REST API client calls; always use `JSON.stringify()` arrays passed through `encodeURIComponent()`.

## 2026-03-30 - Cloudflare Worker Environment Context Parameter Precedence in Signature Verification
**Vulnerability:** Signature verification helpers in edge runtimes previously evaluated global Cloudflare context or process.env before checking explicit `env` parameters passed into the function, which could result in evaluating stale or undefined global env state during Cloudflare Worker request execution.
**Learning:** Functions accepting explicit Cloudflare `env` objects must check `env?.SECRET` before looking up `globalThis[Symbol.for('__cloudflare-context__')]` or `process.env`.
**Prevention:** Always prioritize explicitly passed runtime `env` parameters in security and signature verification functions on edge platforms.
