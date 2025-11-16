import type { DecodedJWT } from '../types/blog'

/**
 * Base64URL decode helper
 */
function base64UrlDecode(str: string): string {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/')

    const padding = base64.length % 4
    if (padding > 0) {
        base64 += '='.repeat(4 - padding)
    }

    try {
        return atob(base64)
    } catch (e) {
        throw new Error('Invalid base64 string')
    }
}

/**
 * Decode JWT token
 */
export function decodeJWT(token: string): DecodedJWT {
    const parts = token.split('.')

    if (parts.length !== 3) {
        throw new Error('Invalid JWT format. Expected 3 parts separated by dots.')
    }

    const [headerB64, payloadB64, signature] = parts

    try {
        const header = JSON.parse(base64UrlDecode(headerB64))
        const payload = JSON.parse(base64UrlDecode(payloadB64))

        return {
            header,
            payload,
            signature,
        }
    } catch (e) {
        throw new Error(
            'Failed to parse JWT. Invalid base64 encoding or JSON structure.'
        )
    }
}

/**
 * Validate JWT structure
 */
export function isValidJWTStructure(token: string): boolean {
    const parts = token.split('.')
    return parts.length === 3
}

/**
 * Decode JWE token (basic structure check)
 */
export function decodeJWE(token: string): { parts: string[]; isJWE: boolean } {
    const parts = token.split('.')

    if (parts.length !== 5) {
        throw new Error('Invalid JWE format. Expected 5 parts separated by dots.')
    }

    return {
        parts: [
            'Protected Header',
            'Encrypted Key',
            'Initialization Vector',
            'Ciphertext',
            'Authentication Tag',
        ],
        isJWE: true,
    }
}