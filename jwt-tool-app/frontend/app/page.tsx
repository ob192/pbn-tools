import { Metadata } from 'next'
import Main from '@/components/Main'

export const metadata: Metadata = {
    title:
        'JWT & JWE Decoder/Encoder - Free Online Tool | Privacy-First JWT Debugger',
    description:
        'Free, secure JWT and JWE decoder and encoder. Debug OAuth2, OIDC, and API tokens locally in your browser. No server uploads. Support for HMAC, RSA, and ECDSA algorithms.',
    keywords: [
        'JWT decoder',
        'JWT encoder',
        'JSON Web Token',
        'JWE decoder',
        'OAuth2',
        'OIDC',
        'token debugger',
        'JWT verification',
        'HMAC',
        'RSA',
        'ECDSA',
        'client-side JWT',
    ],
    authors: [{ name: 'JWT Decoder Team' }],
    openGraph: {
        title: 'JWT & JWE Decoder/Encoder - Privacy-First JWT Tool',
        description:
            'Decode and encode JSON Web Tokens securely in your browser. No data leaves your device.',
        type: 'website',
        url: 'https://your-domain.com',
        siteName: 'JWT Decoder',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'JWT & JWE Decoder/Encoder',
        description: 'Secure, client-side JWT debugging tool',
    },
    robots: {
        index: true,
        follow: true,
    },
}

const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'Can this tool verify JWT signatures?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, if you provide the correct secret or public key. Verification depends entirely on the key material you supply. Always rely on your backend or identity provider for final trust decisions.'
            }
        },
        {
            '@type': 'Question',
            name: 'Does the tool work offline?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. Once loaded in your browser, all decoding, encoding, and verification logic works without an internet connection. You can even save the page locally for offline use.'
            }
        },
        {
            '@type': 'Question',
            name: 'Can I import JWK keys?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. The tool supports JWK-formatted keys for HMAC, RSA, and EC algorithms. RSA and EC JWKs must include required parameters such as n/e or crv/x/y.'
            }
        },
        {
            '@type': 'Question',
            name: 'Can I decode tokens from Auth0, AWS Cognito, or Azure AD?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. Any standards-compliant JWT can be decoded. For verification, you must supply the correct public key, often available from the provider’s JWKS endpoint.'
            }
        },
        {
            '@type': 'Question',
            name: 'Does the tool highlight token expiration and time-based claims?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. Claims like exp, nbf, and iat are converted into human-readable timestamps to simplify debugging and validation.'
            }
        },
        {
            '@type': 'Question',
            name: 'Can the tool handle malformed or unusual Base64URL tokens?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. The decoder normalizes Base64URL formatting and provides detailed error messages when a token is structurally invalid.'
            }
        },
        {
            '@type': 'Question',
            name: 'Is the “none” algorithm supported?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, but only for safe testing. Never permit the “none” algorithm in production, as it creates unsigned and unverifiable tokens.'
            }
        },
        {
            '@type': 'Question',
            name: 'Are any keys or secrets ever saved?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'No. All secrets and private keys remain only in memory in your browser. Closing or refreshing the page clears everything.'
            }
        },
        {
            '@type': 'Question',
            name: 'Can I export decoded token data?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. You can copy or download the decoded header, payload, or full token structure. All exports remain fully local.'
            }
        },
        {
            '@type': 'Question',
            name: 'Does the tool support symmetric and asymmetric signature checking?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. HMAC can be verified with shared secrets, and RSA/ECDSA with the correct public keys. Ensure EC keys use supported curves (e.g., P-256, P-384, P-521).'
            }
        }
    ]
}

export default function HomePage() {
    return (
        <>
            <Main />

            {/* FAQ JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
        </>
    )
}
