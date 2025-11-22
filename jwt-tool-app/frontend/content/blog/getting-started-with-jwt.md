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

In this guide, you’ll learn:

- What JWTs are and how they’re structured
- How JWT-based authentication flows work
- How to generate and verify JWTs in code
- Practical security tips to avoid common mistakes

---

## What Is a JWT?

A **JWT (JSON Web Token)** is a compact, URL-safe token used to transmit claims between parties. Most JWTs in practice are **JWS tokens**, which means they are:

- **Digitally signed** (integrity & authenticity)
- **Not encrypted** by default (anyone who has the token can read the payload)

Think of a JWT like a signed postcard: the message is visible to anyone who sees it, but the signature proves that it came from the sender and hasn’t been tampered with.

### Key Characteristics

- **Readable payload**: Base64URL-encoded JSON, *not* encrypted
- **Digitally signed**: Prevents modification without the signing key
- **Stateless**: The server doesn’t need to remember sessions
- **Short-lived**: Tokens should expire quickly for safety

### Why Use JWT?

- Works well across APIs and microservices
- Reduces or eliminates server-side session storage
- Easy to pass around (HTTP header, cookie, query param – though query params are discouraged)
- A natural fit for mobile apps, SPAs, and distributed backends

---

## JWT Structure

A JWT consists of **three parts**, separated by dots:

`<header>.<payload>.<signature>`

Example:

`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzc4OSIsImVtYWlsIjoiYWxpY2VAZXhhbXBsZS5jb20iLCJpYXQiOjE3MzY1MzA4MDAsImV4cCI6MTczNjUzNDQwMH0.KOaBc3l6jT6A-8dX3-WjU3vYIYc3yB0xqJsfHAG7TWA`

If you Base64URL-decode the first two parts, you’ll see regular JSON.

### 1. Header

The **header** describes how the token is signed.

~~~json
{
  "alg": "HS256",
  "typ": "JWT"
}
~~~

- `alg`: The signing algorithm (e.g. `HS256`, `RS256`)
- `typ`: Usually `"JWT"`

### 2. Payload

The **payload** contains claims — pieces of information about the subject (user, service, etc.).

~~~json
{
  "sub": "user_789",
  "email": "alice@example.com",
  "role": "admin",
  "iat": 1736530800,
  "exp": 1736534400
}
~~~

Some fields are **registered claims** (standardized) and some are **custom claims**.

Common registered claims:

- `sub` — subject (usually user ID)
- `iat` — issued at (Unix timestamp)
- `exp` — expiration time
- `iss` — issuer (who created the token)
- `aud` — audience (who the token is intended for)

Custom claims can be anything your application needs, such as:

- `email`
- `role` or `roles`
- `scope`

### 3. Signature

The **signature** ensures the token hasn’t been changed.

Conceptually:

~~~text
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
~~~

The server uses a secret (HS256) or a private key (RS256/ES256) to compute this signature. When a token is received, the server recomputes the signature and compares it. If they don’t match, the token has been tampered with.

---

## How JWT Authentication Works

Let’s walk through a typical login flow using JWTs.

1. **User logs in**  
   They send credentials (e.g. email/password) to your `/login` endpoint.

2. **Server validates credentials**  
   The server checks the credentials against a database.

3. **Server generates a JWT**  
   If valid, the server creates a signed JWT containing user claims like `sub`, `email`, `role`, etc.

4. **Client stores the JWT**
    - Ideally in an **HTTP-only, Secure cookie**
    - Or in secure mobile storage  
      (Avoid `localStorage` for security reasons.)

5. **Client sends JWT with each request**  
   Often via the `Authorization` header:

   ~~~http
   Authorization: Bearer <your-jwt-token>
   ~~~

6. **Server verifies the JWT**  
   For each request, the server:
    - Verifies the signature
    - Checks the expiration (`exp`)
    - Validates `iss`, `aud`, etc.

7. **Access is granted or denied**  
   If everything checks out, the request is allowed; otherwise, it’s rejected.

**No server-side session needed** — the token *is* the session.

---

## Hands-On: Creating and Verifying JWTs (Node.js / Express)

Let’s build a minimal example using Node.js, Express, and the `jsonwebtoken` library.

### Project Setup

In a new directory:

~~~bash
npm init -y
npm install express jsonwebtoken dotenv cookie-parser
~~~

Create a `.env` file for your secret:

~~~env
JWT_SECRET=super-strong-secret-change-me
JWT_EXPIRES_IN=15m
PORT=3000
~~~

> Never hardcode secrets in your code or commit `.env` to version control.

### Basic Express Server

Create `server.js`:

~~~js
require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set. Check your .env file.");
}
~~~

### Helper: Generate a JWT

~~~js
function generateAccessToken(user) {
  // Never put sensitive data like passwords in the payload.
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: "example.com",
    audience: "example.com/api",
  });
}
~~~

### Login Route (Issuing JWT in HTTP-Only Cookie)

For simplicity, we’ll “fake” user lookup and password check:

~~~js
// Fake user "database"
const USERS = [
  { id: "user_1", email: "alice@example.com", password: "password123", role: "user" },
  { id: "user_2", email: "admin@example.com", password: "admin123", role: "admin" },
];

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = USERS.find((u) => u.email === email);
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateAccessToken(user);

  // Send JWT in an HTTP-only, Secure cookie
  res.cookie("access_token", token, {
    httpOnly: true,
    secure: true,     // set to true in production (HTTPS)
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 minutes in ms
  });

  return res.json({ message: "Logged in successfully" });
});
~~~

**Key points:**

- `httpOnly: true` → JavaScript can’t read the cookie (protects against XSS stealing tokens).
- `secure: true` → Cookie is only sent over HTTPS.
- `sameSite: "strict"` → Mitigates CSRF in many cases.

### Middleware: Authenticate Requests with JWT

Now, let’s create middleware to protect routes.

~~~js
function authenticateJWT(req, res, next) {
  // Check cookie first (recommended pattern for web)
  const tokenFromCookie = req.cookies.access_token;

  // Optional: also support Authorization header for APIs
  const authHeader = req.headers["authorization"];
  const tokenFromHeader = authHeader && authHeader.startsWith("Bearer ")
    ? authHeader.substring(7)
    : null;

  const token = tokenFromCookie || tokenFromHeader;

  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }

  jwt.verify(
    token,
    JWT_SECRET,
    {
      issuer: "example.com",
      audience: "example.com/api",
    },
    (err, decoded) => {
      if (err) {
        console.error("JWT verification failed:", err.message);
        return res.status(401).json({ message: "Invalid or expired token" });
      }

      // Attach user info to request for downstream handlers
      req.user = decoded;
      next();
    }
  );
}
~~~

### Protected Route Example

~~~js
app.get("/profile", authenticateJWT, (req, res) => {
  // At this point, req.user contains the decoded payload
  return res.json({
    message: "Profile data",
    user: {
      id: req.user.sub,
      email: req.user.email,
      role: req.user.role,
    },
  });
});
~~~

### Logout Route (Clearing the Cookie)

JWTs are stateless, but you can simulate “logout” by clearing the cookie:

~~~js
app.post("/logout", (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  return res.json({ message: "Logged out" });
});
~~~

### Start the Server

Add at the bottom of `server.js`:

~~~js
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
~~~

Test the flow with curl or a REST client:

1. `POST /login` with JSON body `{ "email": "alice@example.com", "password": "password123" }`.
2. Use returned cookie to call `GET /profile`.

---

## Decoding a JWT During Development

Sometimes you just want to **inspect** a JWT to understand its contents. This is fine for debugging, but remember: decoding **does not verify** the token.

~~~js
const token = "<your-jwt-here>";
const decoded = jwt.decode(token, { complete: true });

console.log("Header:", decoded.header);
console.log("Payload:", decoded.payload);
~~~

Use `jwt.verify()` for **security decisions**, not `jwt.decode()`.

---

## Using Asymmetric Keys (RS256) – Optional Upgrade

For multi-service systems, it’s often safer to use **asymmetric algorithms** like `RS256`:

- The **authorization server** signs tokens using a **private key**.
- Each **resource server** only needs the **public key** to verify tokens.

That way, you don’t have to share a single secret across all services.

Conceptual example:

~~~js
const fs = require("fs");
const jwt = require("jsonwebtoken");

const privateKey = fs.readFileSync("./keys/private.key");
const publicKey = fs.readFileSync("./keys/public.key");

// Sign with private key
const token = jwt.sign(
  { sub: "user_789", role: "admin" },
  privateKey,
  {
    algorithm: "RS256",
    expiresIn: "15m",
    issuer: "auth.example.com",
  }
);

// Verify with public key
jwt.verify(token, publicKey, { algorithms: ["RS256"] }, (err, decoded) => {
  if (err) {
    console.error("Verification failed:", err.message);
    return;
  }
  console.log("Verified payload:", decoded);
});
~~~

---

## Security Best Practices with JWT

JWTs are powerful, but misusing them can be dangerous. Keep these practices in mind:

### 1. Don’t Store Sensitive Data in Payloads

JWT payloads are **not encrypted**. Anyone with the token can read:

- Personal data
- Secrets
- Payment info

Only store what you truly need for authorization, like user ID, role, and non-sensitive claims.

### 2. Use Short Expiration Times

Tokens should be **short-lived**:

- Access tokens: often 5–15 minutes
- Longer-lived refresh tokens: stored and protected carefully on the server side or in secure storage

The shorter the lifetime, the less damage if a token is stolen.

### 3. Always Use HTTPS

Never send JWTs over plain HTTP:

- Use **TLS (HTTPS)** for all traffic.
- This protects tokens from being captured via network sniffing.

### 4. Prefer HTTP-Only Cookies for Web Apps

Avoid storing JWTs in `localStorage` or `sessionStorage` in the browser:

- They are accessible via JavaScript and therefore vulnerable to **XSS attacks**.

Instead, use **HTTP-only, Secure cookies** and combine them with:

- Strong **XSS protections** (input validation, CSP, etc.)
- **CSRF protections**, such as:
    - SameSite cookie attributes
    - CSRF tokens
    - Double-submit cookie patterns

### 5. Validate All Token Claims

When verifying tokens, don’t just check the signature. Also validate:

- `exp` → Reject expired tokens
- `nbf` (not before) → Reject tokens used too early
- `iss` → Only accept tokens from your own issuer
- `aud` → Ensure token is intended for your API

Example (Node.js):

~~~js
jwt.verify(
  token,
  JWT_SECRET,
  {
    issuer: "example.com",
    audience: "example.com/api",
  },
  (err, decoded) => {
    // ...
  }
);
~~~

### 6. Pin Allowed Algorithms

Never accept arbitrary algorithms from the token. Explicitly list allowed algorithms:

~~~js
jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] }, (err, decoded) => {
  // ...
});
~~~

This prevents **algorithm confusion** issues (e.g. someone switching `alg` to `none`).

### 7. Rotate Secrets and Keys

Plan for **key rotation**:

- Change secrets/keys regularly.
- Support multiple keys during rotation by including a `kid` (key ID) in the header and maintaining a key store.

---

## When Should You Use JWT?

JWTs shine in **stateless, distributed** architectures.

Great fits:

- API authentication for SPAs and mobile apps
- Microservices that need to trust a common identity provider
- Short-lived access tokens within a system
- SSO (Single Sign-On) scenarios

Less ideal for:

- Long-lived sessions where you need frequent server-side invalidation
- Situations where you must immediately revoke tokens for a specific user (you’ll need token blacklists or short TTLs + refresh tokens)
- Storing sensitive or large amounts of data

---

## Summary

By now you should understand:

- **What JWTs are**: signed, readable tokens for transmitting claims.
- **How they’re structured**: header, payload, signature.
- **How they’re used**: to implement stateless authentication flows.
- **How to use them in code**: using Node.js, Express, and `jsonwebtoken`.
- **How to stay safe**: short-lived tokens, HTTPS, secure storage, and careful validation.

JWTs are a powerful tool — when used correctly. Treat them like house keys: keep them short-lived, hard to forge, and never leave them lying around where anyone can grab them.

Once you’re comfortable with basic JWT authentication, the next steps are:

- Adding **refresh tokens**
- Implementing **role-based access control (RBAC)** from token claims
- Exploring **JWE** (encrypted JWTs) for confidentiality when needed

Happy building, and stay secure!
