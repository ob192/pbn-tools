---
title: "JWT vs JWE: Understanding the Difference"
description: "Learn when to use JWT for authentication and JWE for encryption, with practical examples and security considerations."
date: "2025-01-10"
author: "Security Team"
tags: ["JWT", "JWE", "Encryption", "Security"]
readTime: "6 min read"
---

## JWT vs JWE: What's the Difference?

While both are part of the JOSE (JSON Object Signing and Encryption) family, they solve **different problems**:

- **JWT (typically JWS)** → focuses on **integrity and authenticity** of claims  
- **JWE** → focuses on **confidentiality** via **encryption**

A helpful mental model:

- **JWT (JWS)** = a **signed postcard** → everyone can read it, but they can’t change it without breaking the signature.
- **JWE** = a **sealed envelope** → the message inside is hidden until you decrypt it.

In many real systems, you’ll see:

- **Plain JWT (JWS)** for access tokens and claims propagation
- **JWE** or **nested JWT (JWS inside JWE)** for sensitive data

Let’s walk through both, with practical examples.

---

## Quick Refresher: JWT Basics (JWS)

A **JWT (JSON Web Token)** is often implemented as a **JWS (JSON Web Signature)**: a set of claims formatted as JSON, then **digitally signed**.

Structure (compact form):

```text
<header>.<payload>.<signature>
```

* `header` – metadata (algorithm, type)
* `payload` – claims (subject, role, expiration, etc.)
* `signature` – proves integrity and authenticity

### Example JWT Header and Payload

**Header**

```json
{
  "alg": "RS256",
  "typ": "JWT"
}
```

**Payload**

```json
{
  "sub": "123456",
  "name": "Alice",
  "role": "admin",
  "iat": 1736530800,
  "exp": 1736534400
}
```

Anyone who gets this token can **base64-decode** and read the payload. The **security comes from the signature**, not from hiding the data.

---

## Example: Signing and Verifying a JWT in Node.js (JWS)

Below is a minimal example using the [`jose`](https://www.npmjs.com/package/jose) library.

> This example uses **HS256** (symmetric key). In production, for multi-service architectures, prefer **RS256/ES256** (asymmetric keys).

### Installation

```bash
npm install jose
```

### Signing a JWT (JWS)

```js
// sign-jwt.js
import { SignJWT } from "jose";

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-key");

// Create and sign a JWT for user "alice"
async function createJwt() {
  const jwt = await new SignJWT({
    sub: "user_123",
    name: "Alice",
    role: "admin"
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("15m") // short-lived tokens are safer
    .sign(secretKey);

  console.log("JWT:", jwt);
}

createJwt().catch(console.error);
```

### Verifying a JWT

```js
// verify-jwt.js
import { jwtVerify } from "jose";

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-key");

async function verifyJwt(token) {
  try {
    const { payload, protectedHeader } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"] // pin allowed algorithms
    });

    console.log("Header:", protectedHeader);
    console.log("Payload:", payload);
  } catch (err) {
    console.error("Invalid token:", err.message);
  }
}

// Example usage: pass token as CLI arg
const token = process.argv[2];
verifyJwt(token).catch(console.error);
```

Key points:

* We **pin** the allowed algorithms (`algorithms: ["HS256"]`) to avoid algorithm confusion attacks.
* The **payload is readable**; don’t put secrets there.
* Expiration (`exp`) is enforced during verification.

---

## What Is a JWE?

A **JWE (JSON Web Encryption)** is about **encryption**. It ensures that the enclosed payload is **confidential** and can only be read by someone with the correct decryption key.

Structure (compact form):

```text
<protected-header>.<encrypted-key>.<iv>.<ciphertext>.<tag>
```

* `protected-header` – metadata (encryption algorithm, key wrapping method)
* `encrypted-key` – encrypted symmetric key (when using asymmetric crypto)
* `iv` – initialization vector (nonce)
* `ciphertext` – encrypted payload
* `tag` – authentication tag (for AEAD ciphers like GCM)

### Example JWE Header

```json
{
  "alg": "RSA-OAEP-256",
  "enc": "A256GCM",
  "typ": "JWE"
}
```

Here:

* `alg` = how the content encryption key (CEK) is **wrapped/protected** (e.g., RSA-OAEP-256)
* `enc` = how the payload itself is **encrypted** (e.g., AES-256-GCM)

With JWE, even if someone sees the token, the payload is **unreadable** until decrypted.

---

## Example: Encrypting and Decrypting JWE in Node.js

We’ll again use `jose`, this time with **asymmetric encryption**:

* The **sender** uses the **recipient’s public key** to encrypt
* The **recipient** uses their **private key** to decrypt

### 1. Generate an RSA Key Pair (One-Time Setup)

You can do this with `openssl`:

```bash
# Private key
openssl genrsa -out jwe-private.pem 2048

# Public key
openssl rsa -in jwe-private.pem -pubout -out jwe-public.pem
```

### 2. Encrypting a Payload as JWE

```js
// encrypt-jwe.js
import { importSPKI, CompactEncrypt } from "jose";
import fs from "node:fs/promises";

async function encryptSensitiveData() {
  const publicKeyPem = await fs.readFile("jwe-public.pem", "utf-8");

  // Import public key for encryption
  const publicKey = await importSPKI(publicKeyPem, "RSA-OAEP-256");

  const payload = new TextEncoder().encode(
    JSON.stringify({
      sub: "user_123",
      email: "alice@example.com",
      ssn_last4: "1234",
      iat: Math.floor(Date.now() / 1000)
    })
  );

  const jwe = await new CompactEncrypt(payload)
    .setProtectedHeader({
      alg: "RSA-OAEP-256",
      enc: "A256GCM",
      typ: "JWE"
    })
    .encrypt(publicKey);

  console.log("JWE:", jwe);
}

encryptSensitiveData().catch(console.error);
```

The output is a **compact JWE string**. Its payload is encrypted and unreadable without the private key.

### 3. Decrypting a JWE

```js
// decrypt-jwe.js
import { compactDecrypt, importPKCS8 } from "jose";
import fs from "node:fs/promises";

async function decryptJwe(token) {
  const privateKeyPem = await fs.readFile("jwe-private.pem", "utf-8");

  // Import private key for decryption
  const privateKey = await importPKCS8(privateKeyPem, "RSA-OAEP-256");

  const { plaintext, protectedHeader } = await compactDecrypt(token, privateKey);

  const json = JSON.parse(new TextDecoder().decode(plaintext));

  console.log("Header:", protectedHeader);
  console.log("Decrypted payload:", json);
}

// Example usage: pass token as CLI arg
const token = process.argv[2];
decryptJwe(token).catch(console.error);
```

Here:

* Only the holder of `jwe-private.pem` can decrypt.
* The payload is **fully hidden** during transit and at rest (wherever the JWE is stored).

---

## JWT vs JWE in Practice

Let’s compare their roles in real systems.

### JWT (JWS) – When Integrity Is Enough

Use JWT (JWS) when:

* You need **identity and claims propagation** between services
* The data is **not highly sensitive** (e.g., user ID, role, scope)
* You need **stateless authentication** without server-side session storage
* Multiple services need to **read claims quickly** without decryption

Common use cases:

* API access tokens
* Microservice-to-microservice identity propagation
* Browser or mobile authentication tokens (with secure storage)

### JWE – When You Need Confidentiality

Use JWE when:

* The payload contains **sensitive data**, e.g.:

    * PII (personally identifiable information)
    * Financial data
    * Health-related data
* You need **end-to-end encryption of claims**
* Tokens may pass through **untrusted infrastructure** (proxies, logs, analytics tools)

Typical scenarios:

* Transmitting confidential data between microservices
* Storing encrypted claims that only specific services can read
* Protecting data flowing through user-controlled devices or networks

---

## Example: JWT for API Authentication

This code shows a typical Express middleware verifying a JWT (JWS). No encryption here—just signature validation.

```js
// auth-middleware.js
import { jwtVerify } from "jose";

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-key");

export async function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }

  const token = authHeader.substring("Bearer ".length);

  try {
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
      audience: "my-api",
      issuer: "https://auth.example.com"
    });

    // Attach user info to the request
    req.user = {
      id: payload.sub,
      role: payload.role,
      scopes: payload.scope
    };

    return next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
```

Here:

* The token is assumed to be a **JWT (JWS)**.
* The API checks **signature**, **issuer**, and **audience**.
* Claims such as `role` and `scope` are used for authorization.

---

## Example: Nested JWT – JWS Inside JWE

For **sensitive flows**, a common pattern is:

1. **Sign** the claims (JWS) → ensures integrity and authenticity.
2. **Encrypt** the signed token (JWE) → ensures confidentiality.

Conceptually:

```text
JWE( JWS( claims ) )
```

### Signing and Then Encrypting

```js
// nested-jwt.js
import { SignJWT, CompactEncrypt } from "jose";
import { importSPKI } from "jose";
import fs from "node:fs/promises";

async function createNestedToken() {
  const hmacSecret = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-key");
  const publicKeyPem = await fs.readFile("jwe-public.pem", "utf-8");
  const publicKey = await importSPKI(publicKeyPem, "RSA-OAEP-256");

  // 1. Create JWS (signed JWT)
  const jws = await new SignJWT({
    sub: "user_123",
    email: "alice@example.com",
    role: "premium",
    iat: Math.floor(Date.now() / 1000)
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime("10m")
    .sign(hmacSecret);

  // 2. Encrypt the JWS as JWE
  const payload = new TextEncoder().encode(jws);

  const jwe = await new CompactEncrypt(payload)
    .setProtectedHeader({
      alg: "RSA-OAEP-256",
      enc: "A256GCM",
      typ: "JWE"
    })
    .encrypt(publicKey);

  console.log("Nested token (JWE of JWS):", jwe);
}

createNestedToken().catch(console.error);
```

On the receiving side:

1. **Decrypt JWE** with the private key → recover the JWS string.
2. **Verify JWS** with the shared secret or public key (depending on algorithm).

This gives you:

* **Integrity** (from JWS)
* **Authenticity** (from JWS)
* **Confidentiality** (from JWE)

---

## Security Best Practices for JWT and JWE

Whether you use JWT, JWE, or both, keep these in mind:

1. **Never store secrets in JWT payloads**

    * JWT/JWS payloads are readable.
    * Treat JWT as **integrity**, not **privacy**.

2. **Use short expiration times (`exp`)**

    * Reduces the damage if a token is leaked.
    * Short-lived access tokens + long-lived refresh tokens is a good pattern.

3. **Pin algorithms explicitly**

    * When verifying, always specify allowed algorithms (e.g., `["RS256"]`).
    * This prevents algorithm confusion and `none` attacks.

4. **Use HTTPS everywhere**

    * Never send tokens over plain HTTP.
    * Tokens are bearer credentials—whoever has them is “you”.

5. **Rotate keys regularly**

    * Use key IDs (`kid`) in headers.
    * Support multiple keys and rotate them safely.

6. **Store tokens securely**

    * In browsers, prefer **HTTP-only, secure cookies** instead of `localStorage`.
    * On mobile, rely on secure OS-provided keychains or equivalent.

7. **Use JWE or nested tokens for sensitive data**

    * If the payload contains PII or something that would be damaging if leaked, encrypt it.
    * Consider the nested pattern: **JWS inside JWE**.

---

## Summary

* **JWT (typically JWS)** focuses on **integrity and authenticity** of claims. The payload is readable, so avoid storing secrets.
* **JWE** focuses on **confidentiality**, keeping the payload hidden via encryption.
* Use **JWT** for:

    * API authentication
    * Stateless session tokens
    * Microservice identity propagation
      when the data is **not highly sensitive**.
* Use **JWE** (or **nested JWS-in-JWE**) for:

    * Sensitive or regulated data
    * End-to-end encrypted claims
    * Flows where intermediaries must not read the payload
* For high-security systems, combining **JWS + JWE** gives you **integrity + authenticity + confidentiality** in a single, robust pattern.

By understanding when to use JWT, when to use JWE, and how to combine them, you can design authentication and data-sharing mechanisms that are both **practical** and **secure**.

```
::contentReference[oaicite:0]{index=0}
```
