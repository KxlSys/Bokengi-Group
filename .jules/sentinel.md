## 2026-03-30 - ERPNext REST API Filter Injection Prevention
**Vulnerability:** Raw string interpolation of untrusted input (e.g. `slug`, `poleSlug`, `cleanEmail`) into ERPNext REST API `filters` URL query parameter allowed filter syntax injection and query manipulation.
**Learning:** In Frappe / ERPNext REST API endpoints (`/api/resource/<DocType>?filters=...`), query filters should be constructed as JavaScript arrays, serialized via `JSON.stringify()`, and encoded using `encodeURIComponent()`.
**Prevention:** Avoid template literals for JSON filter parameters in REST API client calls; always use `JSON.stringify()` arrays passed through `encodeURIComponent()`.
