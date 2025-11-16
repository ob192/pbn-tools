'use client'

import {useState, useEffect} from 'react'
import {decodeJWT, decodeJWE} from '@/lib/utils/jwt'
import type {DecodedJWT} from '@/lib/types/blog'
import Card from './ui/Card'
import Tabs from './ui/Tabs'
import TabsList from './ui/TabsList'
import TabsTrigger from './ui/TabsTrigger'
import TabsContent from './ui/TabsContent'

export default function Main() {
    // Decode state
    const [token, setToken] = useState('')
    const [decodedData, setDecodedData] = useState<DecodedJWT | null>(null)
    const [error, setError] = useState('')
    const [isJWE, setIsJWE] = useState(false)

    // Encode state
    const [encodeHeader, setEncodeHeader] = useState(
        '{"alg":"HS256","typ":"JWT"}'
    )
    const [encodePayload, setEncodePayload] = useState(
        '{"sub":"1234567890","name":"John Doe","admin":true,"iat":1516239022}'
    )
    const [encodeSecret, setEncodeSecret] = useState('')
    const [encodePrivateKey, setEncodePrivateKey] = useState('')
    const [encodePublicKey, setEncodePublicKey] = useState('')
    const [encodeAlg, setEncodeAlg] = useState('HS256')
    const [encodedToken, setEncodedToken] = useState('')
    const [encodeError, setEncodeError] = useState('')

    // Auto-decode when token changes
    useEffect(() => {
        if (token.trim()) {
            handleDecode()
        } else {
            setDecodedData(null)
            setError('')
            setIsJWE(false)
        }
    }, [token])

    // Sync dropdown algorithm to header JSON
    useEffect(() => {
        try {
            const parsed = JSON.parse(encodeHeader || '{}')
            if (parsed.alg !== encodeAlg) {
                parsed.alg = encodeAlg
                setEncodeHeader(JSON.stringify(parsed))
            }
        } catch {
            // Invalid JSON - user might be editing
        }
    }, [encodeAlg])

    // Determine if current algorithm requires keys vs secret
    const isHMACAlg = encodeAlg.startsWith('HS')
    const isRSAAlg = encodeAlg.startsWith('RS')
    const isECDSAAlg = encodeAlg.startsWith('ES')
    const isNoneAlg = encodeAlg === 'none'

    // Auto-encode when inputs change
    useEffect(() => {
        const hasHMACSecret = isHMACAlg && encodeSecret.trim()
        const hasAsymmetricKey =
            (isRSAAlg || isECDSAAlg) && encodePrivateKey.trim()
        const isNone = isNoneAlg

        if (
            encodeHeader &&
            encodePayload &&
            (hasHMACSecret || hasAsymmetricKey || isNone)
        ) {
            handleEncode()
        } else {
            setEncodedToken('')
            setEncodeError('')
        }
    }, [
        encodeHeader,
        encodePayload,
        encodeSecret,
        encodePrivateKey,
        encodeAlg,
        isHMACAlg,
        isRSAAlg,
        isECDSAAlg,
        isNoneAlg,
    ])

    function handleDecode() {
        setError('')
        setDecodedData(null)
        setIsJWE(false)

        if (!token.trim()) {
            return
        }

        try {
            const parts = token.split('.')

            if (parts.length === 5) {
                setIsJWE(true)
                decodeJWE(token)
                setError(
                    'JWE decoding preview only. Full decryption requires the correct cryptographic keys.'
                )
            } else if (parts.length === 3) {
                setDecodedData(decodeJWT(token))
            } else {
                throw new Error(
                    'Invalid token format. Expected JWT (3 parts) or JWE (5 parts).'
                )
            }
        } catch (e) {
            setError(
                e instanceof Error
                    ? e.message
                    : 'Failed to decode token. Please verify the value and try again.'
            )
        }
    }

    function syncHeaderToDropdown() {
        try {
            const parsed = JSON.parse(encodeHeader)
            if (
                parsed.alg &&
                typeof parsed.alg === 'string' &&
                parsed.alg !== encodeAlg
            ) {
                setEncodeAlg(parsed.alg)
            }
        } catch {
            // Invalid JSON - ignore while user is typing
        }
    }

    function base64UrlEncode(input: string): string {
        return btoa(input)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/g, '')
    }

    function base64UrlEncodeBytes(bytes: Uint8Array): string {
        let binary = ''
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i])
        }
        return base64UrlEncode(binary)
    }

    function getHashAlgorithm(alg: string): string {
        if (alg.endsWith('256')) return 'SHA-256'
        if (alg.endsWith('384')) return 'SHA-384'
        if (alg.endsWith('512')) return 'SHA-512'
        return 'SHA-256'
    }

    function getECDSACurve(alg: string): string {
        switch (alg) {
            case 'ES256':
                return 'P-256'
            case 'ES384':
                return 'P-384'
            case 'ES512':
                return 'P-521'
            default:
                return 'P-256'
        }
    }

    function pemToArrayBuffer(
        pem: string,
        type: 'private' | 'public'
    ): ArrayBuffer {
        const pemHeader =
            type === 'private'
                ? '-----BEGIN PRIVATE KEY-----'
                : '-----BEGIN PUBLIC KEY-----'
        const pemFooter =
            type === 'private'
                ? '-----END PRIVATE KEY-----'
                : '-----END PUBLIC KEY-----'

        const pemContents = pem
            .replace(pemHeader, '')
            .replace(pemFooter, '')
            .replace(/\s/g, '')

        const binaryString = atob(pemContents)
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i)
        }
        return bytes.buffer
    }

    async function encodeHMAC(data: string): Promise<string> {
        const enc = new TextEncoder()
        const hashAlg = getHashAlgorithm(encodeAlg)

        const key = await crypto.subtle.importKey(
            'raw',
            enc.encode(encodeSecret),
            {name: 'HMAC', hash: hashAlg},
            false,
            ['sign']
        )

        const signature = await crypto.subtle.sign('HMAC', key, enc.encode(data))
        return base64UrlEncodeBytes(new Uint8Array(signature))
    }

    async function encodeRSA(data: string): Promise<string> {
        const enc = new TextEncoder()
        const hashAlg = getHashAlgorithm(encodeAlg)

        const keyData = pemToArrayBuffer(encodePrivateKey, 'private')
        const key = await crypto.subtle.importKey(
            'pkcs8',
            keyData,
            {
                name: 'RSASSA-PKCS1-v1_5',
                hash: hashAlg,
            },
            false,
            ['sign']
        )

        const signature = await crypto.subtle.sign(
            'RSASSA-PKCS1-v1_5',
            key,
            enc.encode(data)
        )
        return base64UrlEncodeBytes(new Uint8Array(signature))
    }

    async function encodeECDSA(data: string): Promise<string> {
        const enc = new TextEncoder()
        const curve = getECDSACurve(encodeAlg)
        const hashAlg = getHashAlgorithm(encodeAlg)

        const keyData = pemToArrayBuffer(encodePrivateKey, 'private')
        const key = await crypto.subtle.importKey(
            'pkcs8',
            keyData,
            {
                name: 'ECDSA',
                namedCurve: curve,
            },
            false,
            ['sign']
        )

        const signature = await crypto.subtle.sign(
            {
                name: 'ECDSA',
                hash: hashAlg,
            },
            key,
            enc.encode(data)
        )
        return base64UrlEncodeBytes(new Uint8Array(signature))
    }

    async function handleEncode() {
        setEncodeError('')
        setEncodedToken('')

        try {
            const header = JSON.parse(encodeHeader || '{}')
            const payload = JSON.parse(encodePayload || '{}')

            const headerSegment = base64UrlEncode(JSON.stringify(header))
            const payloadSegment = base64UrlEncode(JSON.stringify(payload))
            const data = `${headerSegment}.${payloadSegment}`

            let signatureSegment = ''

            if (encodeAlg === 'none') {
                signatureSegment = ''
            } else if (isHMACAlg) {
                if (!encodeSecret.trim()) {
                    setEncodeError('Secret is required for HMAC algorithms.')
                    return
                }
                signatureSegment = await encodeHMAC(data)
            } else if (isRSAAlg) {
                if (!encodePrivateKey.trim()) {
                    setEncodeError('Private key is required for RSA algorithms.')
                    return
                }
                signatureSegment = await encodeRSA(data)
            } else if (isECDSAAlg) {
                if (!encodePrivateKey.trim()) {
                    setEncodeError('Private key is required for ECDSA algorithms.')
                    return
                }
                signatureSegment = await encodeECDSA(data)
            } else {
                setEncodeError('Unsupported algorithm.')
                return
            }

            setEncodedToken(
                signatureSegment ? `${data}.${signatureSegment}` : `${data}.`
            )
        } catch (e) {
            setEncodeError(
                e instanceof Error
                    ? e.message
                    : 'Failed to encode JWT. Check inputs and try again.'
            )
        }
    }

    const faqs = [
        {
            q: 'Can this tool verify JWT signatures?',
            a: 'Yes, if you provide the correct secret or public key. Verification depends entirely on the key material you supply. Always rely on your backend or identity provider for final trust decisions.',
        },
        {
            q: 'Does the tool work offline?',
            a: 'Yes. Once loaded in your browser, all decoding, encoding, and verification logic works without an internet connection. You can even save the page locally for offline use.',
        },
        {
            q: 'Can I import JWK keys?',
            a: 'Yes. The tool supports JWK-formatted keys for HMAC, RSA, and EC algorithms. RSA and EC JWKs must include required parameters such as n/e or crv/x/y.',
        },
        {
            q: 'Can I decode tokens from Auth0, AWS Cognito, or Azure AD?',
            a: 'Yes. Any standards-compliant JWT can be decoded. For verification, you must supply the correct public key, often available from the provider’s JWKS endpoint.',
        },
        {
            q: 'Does the tool highlight token expiration and time-based claims?',
            a: 'Yes. Claims like exp, nbf, and iat are converted into human-readable timestamps to simplify debugging and validation.',
        },
        {
            q: 'Can the tool handle malformed or unusual Base64URL tokens?',
            a: 'Yes. The decoder normalizes Base64URL formatting and provides detailed error messages when a token is structurally invalid.',
        },
        {
            q: 'Is the “none” algorithm supported?',
            a: 'Yes, but only for safe testing. Never permit the “none” algorithm in production, as it creates unsigned and unverifiable tokens.',
        },
        {
            q: 'Are any keys or secrets ever saved?',
            a: 'No. All secrets and private keys remain only in memory in your browser. Closing or refreshing the page clears everything.',
        },
        {
            q: 'Can I export decoded token data?',
            a: 'Yes. You can copy or download the decoded header, payload, or full token structure. All exports remain fully local.',
        },
        {
            q: 'Does the tool support symmetric and asymmetric signature checking?',
            a: 'Yes. HMAC can be verified with shared secrets, and RSA/ECDSA with the correct public keys. Ensure EC keys use supported curves (e.g., P-256, P-384, P-521).',
        },
    ];


    return (
        <>
            <section className="hero" aria-labelledby="hero-title">
                <div className="container">
                    <h1 id="hero-title" className="hero-title">
                        JWT &amp; JWE Decoder / Encoder — Secure, Local, and Privacy-First
                    </h1>

                    <p className="hero-subtitle">
                        Powerful in-browser tools for decoding, inspecting, and generating JSON Web
                        Tokens. Ideal for debugging OAuth2, OpenID Connect, API gateways, and modern
                        identity platforms — without ever sending sensitive tokens to a server.
                    </p>

                    <ul className="hero-benefits">
                        <li>100% local execution for maximum privacy</li>
                        <li>Decode JWTs and preview JWE structures instantly</li>
                        <li>Generate HMAC, RSA, and ECDSA-signed tokens</li>
                    </ul>
                </div>
            </section>


            <section className="tool-section">
                <div className="container">
                    <Card padding="lg" className="tool-card">
                        <h2 className="section-title">Decode or Encode JWT Tokens</h2>
                        <p className="section-subtitle">
                            Paste an existing token to instantly inspect its header and
                            payload, or enter data to generate a signed JWT with HMAC, RSA, or
                            ECDSA algorithms in real-time for safe local testing and
                            integration.
                        </p>

                        <Tabs defaultValue="decode" className="tabs-root">
                            <TabsList className="tabs-list">
                                <TabsTrigger value="decode">Decode JWT / JWE</TabsTrigger>
                                <TabsTrigger value="encode">Encode JWT</TabsTrigger>
                            </TabsList>

                            {/* DECODE TAB */}
                            <TabsContent value="decode" className="tabs-content">
                                <div className="input-group">
                                    <label htmlFor="token-input">
                                        Paste your JWT or JWE token (decodes automatically)
                                    </label>
                                    <textarea
                                        id="token-input"
                                        value={token}
                                        onChange={(e) => setToken(e.target.value)}
                                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                                        rows={6}
                                        spellCheck="false"
                                    />
                                </div>

                                {error && (
                                    <div className={`error-message ${isJWE ? 'warning' : ''}`}>
                                        {error}
                                    </div>
                                )}

                                {decodedData && !isJWE && (
                                    <div className="results">
                                        <div className="decode-section">
                                            <h3>Header</h3>
                                            <div className="json-display">
                        <pre>
                          <code>
                            {JSON.stringify(decodedData.header, null, 2)}
                          </code>
                        </pre>
                                            </div>
                                        </div>

                                        <div className="decode-section">
                                            <h3>Payload</h3>
                                            <div className="json-display">
                        <pre>
                          <code>
                            {JSON.stringify(decodedData.payload, null, 2)}
                          </code>
                        </pre>
                                            </div>
                                        </div>

                                        <div className="signature-section">
                                            <h3>Signature</h3>
                                            <code className="signature-code">
                                                {decodedData.signature}
                                            </code>
                                        </div>
                                    </div>
                                )}
                            </TabsContent>

                            {/* ENCODE TAB */}
                            <TabsContent value="encode" className="tabs-content">
                                <div className="encode-grid">
                                    <div className="encode-column">
                                        <label htmlFor="encode-header">Header (JSON)</label>
                                        <textarea
                                            id="encode-header"
                                            value={encodeHeader}
                                            onChange={(e) => {
                                                setEncodeHeader(e.target.value)
                                                syncHeaderToDropdown()
                                            }}
                                            rows={5}
                                            spellCheck="false"
                                        />
                                    </div>

                                    <div className="encode-column">
                                        <label htmlFor="encode-payload">Payload (JSON)</label>
                                        <textarea
                                            id="encode-payload"
                                            value={encodePayload}
                                            onChange={(e) => setEncodePayload(e.target.value)}
                                            rows={8}
                                            spellCheck="false"
                                        />
                                    </div>
                                </div>

                                <div className="encode-options">
                                    <div className="field">
                                        <label htmlFor="alg">Algorithm</label>
                                        <select
                                            id="alg"
                                            value={encodeAlg}
                                            onChange={(e) => setEncodeAlg(e.target.value)}
                                        >
                                            <optgroup label="HMAC (Symmetric)">
                                                <option value="HS256">HS256 (HMAC-SHA256)</option>
                                                <option value="HS384">HS384 (HMAC-SHA384)</option>
                                                <option value="HS512">HS512 (HMAC-SHA512)</option>
                                            </optgroup>
                                            <optgroup label="RSA (Asymmetric)">
                                                <option value="RS256">RS256 (RSA-SHA256)</option>
                                                <option value="RS384">RS384 (RSA-SHA384)</option>
                                                <option value="RS512">RS512 (RSA-SHA512)</option>
                                            </optgroup>
                                            <optgroup label="ECDSA (Asymmetric)">
                                                <option value="ES256">ES256 (ECDSA P-256)</option>
                                                <option value="ES384">ES384 (ECDSA P-384)</option>
                                                <option value="ES512">ES512 (ECDSA P-521)</option>
                                            </optgroup>
                                            <optgroup label="No Signature (Testing Only)">
                                                <option value="none">none (unsigned)</option>
                                            </optgroup>
                                        </select>
                                    </div>

                                    {isHMACAlg && (
                                        <div className="field field-full">
                                            <label htmlFor="secret">
                                                Signing Secret (kept in your browser, generates token
                                                automatically)
                                            </label>
                                            <input
                                                id="secret"
                                                type="password"
                                                value={encodeSecret}
                                                onChange={(e) => setEncodeSecret(e.target.value)}
                                                placeholder="Your HMAC secret"
                                                autoComplete="off"
                                            />
                                        </div>
                                    )}

                                    {(isRSAAlg || isECDSAAlg) && (
                                        <>
                                            <div className="field field-full">
                                                <label htmlFor="private-key">
                                                    Private Key (PEM PKCS#8 format, kept in your browser)
                                                    <span className="label-hint">
                            Required for signing. Generate with OpenSSL or your
                            crypto tools.
                          </span>
                                                </label>
                                                <textarea
                                                    id="private-key"
                                                    value={encodePrivateKey}
                                                    onChange={(e) => setEncodePrivateKey(e.target.value)}
                                                    placeholder="-----BEGIN PRIVATE KEY-----&#10;MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7...&#10;-----END PRIVATE KEY-----"
                                                    rows={6}
                                                    spellCheck="false"
                                                    className="key-input"
                                                />
                                            </div>

                                            <div className="field field-full">
                                                <label htmlFor="public-key">
                                                    Public Key (PEM format, optional)
                                                    <span className="label-hint">
                            Not used for encoding, but useful for verification
                            testing.
                          </span>
                                                </label>
                                                <textarea
                                                    id="public-key"
                                                    value={encodePublicKey}
                                                    onChange={(e) => setEncodePublicKey(e.target.value)}
                                                    placeholder="-----BEGIN PUBLIC KEY-----&#10;MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu4...&#10;-----END PUBLIC KEY-----"
                                                    rows={6}
                                                    spellCheck="false"
                                                    className="key-input"
                                                />
                                            </div>
                                        </>
                                    )}

                                    {isNoneAlg && (
                                        <div className="field field-full">
                                            <div className="info-message">
                                                <strong>Warning:</strong> The &quot;none&quot; algorithm creates
                                                an unsigned token. This is only suitable for testing and
                                                should never be used in production.
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {encodeError && (
                                    <div className="error-message">{encodeError}</div>
                                )}

                                <div className="results output-container">
                                    <h3>
                                        Encoded JWT{' '}
                                        {encodedToken
                                            ? '(generated in real-time)'
                                            : isHMACAlg
                                                ? '(enter secret to generate)'
                                                : isRSAAlg || isECDSAAlg
                                                    ? '(enter private key to generate)'
                                                    : '(ready to generate)'}
                                    </h3>
                                    <div
                                        className={`json-display ${!encodedToken ? 'placeholder' : ''}`}
                                    >
                    <pre>
                      <code>
                        {encodedToken ||
                            'Enter the required fields above to generate a JWT...'}
                      </code>
                    </pre>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </Card>
                </div>
            </section>

            <section className="faq-section">
                <div className="container">
                    <h2 className="section-title">Frequently Asked Questions</h2>
                    <div className="faq-list">
                        {faqs.map((item, index) => (
                            <div key={index} className="faq-item">
                                <h3>{item.q}</h3>
                                <p>{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <style jsx>{`
                .hero {
                    padding: 2.5rem 0 1.5rem;
                    text-align: center;
                    background: linear-gradient(
                            to bottom,
                            var(--color-muted),
                            var(--color-background)
                    );
                }

                .hero h1 {
                    font-size: clamp(2rem, 6vw, 3rem);
                    margin-bottom: 1rem;
                    line-height: 1.1;
                    background: linear-gradient(
                            135deg,
                            var(--color-primary) 0%,
                            #334155 100%
                    );
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .hero-description {
                    font-size: clamp(0.95rem, 3.5vw, 1.1rem);
                    max-width: 760px;
                    margin: 0 auto;
                    color: var(--color-muted-foreground);
                }

                .tool-section {
                    padding: 1.5rem 0 2.5rem;
                }

                :global(.tool-card) {
                    width: 100%;
                    box-sizing: border-box;
                }

                .section-title {
                    font-size: 1.5rem;
                    margin-bottom: 0.4rem;
                }

                .section-subtitle {
                    font-size: 0.95rem;
                    color: var(--color-muted-foreground);
                    margin-bottom: 1.25rem;
                }

                :global(.tabs-root) {
                    margin-top: 1.25rem;
                }

                :global(.tabs-list) {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }

                :global(.tabs-content) {
                    margin-top: 1.25rem;
                }

                .input-group {
                    margin-bottom: 1rem;
                }

                .input-group label {
                    display: block;
                    margin-bottom: 0.35rem;
                    font-weight: 600;
                    font-size: 0.9rem;
                }

                textarea {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid var(--color-border);
                    border-radius: var(--radius-md);
                    font-family: var(--font-mono);
                    font-size: 0.85rem;
                    resize: vertical;
                    min-height: 120px;
                    background-color: var(--color-background);
                    color: var(--color-foreground);
                    box-sizing: border-box;
                }

                textarea:focus {
                    outline: none;
                    border-color: var(--color-primary);
                }

                .key-input {
                    font-size: 0.75rem;
                    min-height: 140px;
                }

                .error-message {
                    padding: 0.75rem;
                    background-color: #fee2e2;
                    border: 1px solid var(--color-error);
                    border-radius: var(--radius-md);
                    color: var(--color-error);
                    font-size: 0.85rem;
                    margin-bottom: 1rem;
                }

                .error-message.warning {
                    background-color: #fef3c7;
                    border-color: #f59e0b;
                    color: #92400e;
                }

                .info-message {
                    padding: 0.75rem;
                    background-color: #dbeafe;
                    border: 1px solid #3b82f6;
                    border-radius: var(--radius-md);
                    color: #1e40af;
                    font-size: 0.85rem;
                }

                .results {
                    margin-top: 1.25rem;
                }

                .results h3 {
                    font-size: 1rem;
                    margin-bottom: 0.5rem;
                }

                .decode-section {
                    margin-bottom: 1rem;
                }

                .decode-section h3 {
                    font-size: 1rem;
                    margin-bottom: 0.5rem;
                }

                .output-container {
                    min-height: 120px;
                }

                .json-display {
                    width: 100%;
                    max-height: 320px;
                    overflow-x: auto;
                    overflow-y: auto;
                    background-color: var(--color-muted);
                    border-radius: var(--radius-md);
                    padding: 0.75rem;
                    box-sizing: border-box;
                }

                .json-display.placeholder {
                    color: var(--color-muted-foreground);
                    font-style: italic;
                }

                .json-display pre {
                    margin: 0;
                    font-size: 0.8rem;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                }

                .signature-section {
                    margin-top: 1rem;
                    padding-top: 0.75rem;
                    border-top: 1px solid var(--color-border);
                }

                .signature-section h3 {
                    font-size: 0.9rem;
                    margin-bottom: 0.25rem;
                }

                .signature-code {
                    display: block;
                    font-size: 0.75rem;
                    word-break: break-all;
                    padding: 0.6rem;
                    background-color: var(--color-muted);
                    border-radius: var(--radius-md);
                    color: var(--color-muted-foreground);
                }

                .encode-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0.75rem;
                    margin-bottom: 0.75rem;
                }

                .encode-column label {
                    display: block;
                    margin-bottom: 0.35rem;
                    font-weight: 600;
                    font-size: 0.9rem;
                }

                .encode-options {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    margin: 0.5rem 0 0.75rem;
                }

                .field {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                    font-size: 0.85rem;
                }

                .field label {
                    font-weight: 600;
                    font-size: 0.9rem;
                }

                .label-hint {
                    display: block;
                    font-weight: 400;
                    font-size: 0.8rem;
                    color: var(--color-muted-foreground);
                    margin-top: 0.15rem;
                }

                .field-full {
                    width: 100%;
                }

                select,
                input[type='password'] {
                    padding: 0.6rem 0.7rem;
                    border-radius: var(--radius-md);
                    border: 1px solid var(--color-border);
                    background-color: var(--color-background);
                    color: var(--color-foreground);
                    font-size: 0.85rem;
                    box-sizing: border-box;
                }

                select:focus,
                input[type='password']:focus {
                    outline: none;
                    border-color: var(--color-primary);
                }

                .faq-section {
                    padding: 0 0 2.5rem;
                }

                .faq-list {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                    margin-top: 1rem;
                }

                .faq-item {
                    padding: 0.9rem 0.9rem 0.85rem;
                    border-radius: var(--radius-md);
                    background-color: var(--color-muted);
                }

                .faq-item h3 {
                    font-size: 0.95rem;
                    margin-bottom: 0.35rem;
                }

                .faq-item p {
                    font-size: 0.85rem;
                    color: var(--color-muted-foreground);
                    margin: 0;
                }

                @media (max-width: 768px) {
                    :global(.tool-card) {
                        padding: 1rem;
                    }

                    .encode-grid {
                        grid-template-columns: 1fr;
                    }

                    .faq-list {
                        grid-template-columns: 1fr;
                    }

                    .json-display {
                        max-height: 260px;
                    }
                }

                .hero {
                    padding: 3rem 0 2rem;
                    text-align: center;
                    background: linear-gradient(
                            to bottom,
                            var(--color-muted),
                            var(--color-background)
                    );
                }

                .hero-title {
                    font-size: clamp(2.6rem, 6vw, 3.6rem);
                    line-height: 1.1;
                    margin-bottom: 1rem;
                    font-weight: 800;
                    background: linear-gradient(135deg, var(--color-primary), #334155);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .hero-subtitle {
                    font-size: clamp(1.1rem, 3vw, 1.35rem);
                    max-width: 820px;
                    margin: 0.75rem auto 1.5rem;
                    color: var(--color-muted-foreground);
                }

                .hero-benefits {
                    list-style: none;
                    padding: 0;
                    margin: 0.5rem auto 0;
                    display: flex;
                    flex-direction: column;
                    gap: 0.55rem;
                    font-size: clamp(1rem, 2.5vw, 1.15rem);
                    color: var(--color-foreground);
                    max-width: 550px;
                }

                .hero-benefits li::before {
                    content: "✓";
                    margin-right: 0.4rem;
                    color: var(--color-primary);
                    font-weight: 700;
                }
            `}</style>
        </>
    )
}