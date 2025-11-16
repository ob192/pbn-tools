---
title: "Getting Started with JWT: A Practical Beginner’s Guide"
description: "Learn what JSON Web Tokens are, how they work, and how to use them safely for authentication and authorization."
date: "2025-01-10"
author: "Security Team"
tags: ["JWT", "Authentication", "Security", "Tokens"]
readTime: "6 min read"
---

## Getting Started with JWT

JSON Web Tokens (**JWTs**) are one of the most common ways to handle authentication and authorization in modern applications. They’re lightweight, self-contained tokens that allow services to securely share identity information without relying on server-side session storage.

If you’ve ever wondered how a website “remembers” you after logging in—JWTs are often at work behind the scenes.

---

## What Is a JWT?

A **JWT (JSON Web Token)** is a compact, URL-safe token used to transmit claims between parties. Most JWTs are actually **JWS tokens**, meaning they are *digitally signed* but **not encrypted**. Anyone who obtains a JWT can decode and read its payload—the protection comes from the signature, which prevents tampering.

Think of a JWT like a signed postcard: the message is visible, but the signature proves it hasn’t been altered.

### Key Characteristics

- **Readable payload** (Base64URL-encoded, not encrypted)
- **Digitally signed** for integrity and authenticity
- **Stateless** — no server session storage required
- **Short-lived** by design

### Why Use JWT?

- Works well across APIs and microservices
- Reduces session storage overhead
- Simple to generate and verify
- Great fit for distributed systems

---

## JWT Structure

A JWT consists of **three parts**, separated by dots:

```

<header>.<payload>.<signature>
```

### 1. Header

Specifies metadata such as signing algorithm and token type.

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### 2. Payload

Contains identity information and claims.

```json
{
  "sub": "user_789",
  "email": "alice@example.com",
  "role": "admin",
  "iat": 1736530800,
  "exp": 1736534400
}
```

### 3. Signature

Ensures the token hasn't been altered.

```
HMACSHA256( base64UrlEncode(header) + "." + base64UrlEncode(payload), secret )
```

---

## How JWT Authentication Works

Here’s the typical flow:

### 1. User logs in

Provides credentials like email + password.

### 2. Server validates the credentials

If correct, it generates a signed JWT containing the user’s claims.

### 3. Client stores the JWT

Usually in:

* HTTP-only cookies
* Secure storage on mobile devices

### 4. Client sends JWT with each request

Typically in the `Authorization: Bearer <token>` header.

### 5. Server verifies the token

Checks signature + expiration → grants access.

**No server-side session needed — the token *is* the session.**

---

## When Should You Use JWT?

JWTs excel in distributed, stateless environments.

### Ideal Use Cases

* API authentication
* Mobile and SPA login flows
* Identity propagation between microservices
* Short-lived access tokens
* SSO (Single Sign-On)

### Not Ideal For

* Long-lived sessions
* Storing sensitive or private data
* Systems requiring server-side revocation

---

## Common JWT Claims

| Claim   | Meaning                   |
| ------- | ------------------------- |
| `sub`   | Subject (usually user ID) |
| `iat`   | Issued at timestamp       |
| `exp`   | Expiration time           |
| `iss`   | Issuer                    |
| `aud`   | Audience                  |
| `scope` | User permissions          |

---

## Security Best Practices

### 1. **Don’t store sensitive data in payloads**

JWTs are **not encrypted** by default.

### 2. **Use short expiration times**

Minimize damage if the token leaks.

### 3. **Use HTTPS everywhere**

Never transmit JWTs over insecure connections.

### 4. **Prefer asymmetric algorithms (RS256, ES256)**

Safer for multi-service architectures.

### 5. **Validate all token fields**

`exp`, `iss`, `aud` — don’t skip them.

### 6. **Store tokens securely**

Avoid `localStorage` for browser apps; use HTTP-only cookies instead.

### 7. **Rotate keys regularly**

Shorter key lifetimes = lower risk.

---

## Example End-to-End Flow

Decoded sample payload:

```json
{
  "sub": "12345",
  "name": "Alice",
  "role": "user",
  "iat": 1736530800,
  "exp": 1736534400
}
```

This token can now be sent with each request and verified by any service that holds the signing key.

---

## Summary

* **JWTs are signed, readable tokens** used to transmit identity and claims.
* They provide **integrity**, but **not confidentiality**.
* Perfect for stateless APIs, microservices, and short-lived sessions.
* Always secure them with proper expiration, validation, and storage practices.
* For confidential data, use **JWE** or a nested JWS-in-JWE token.


