'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { totp } from 'otplib'

// Base32 character set (RFC 4648)
const BASE32_CHARS = /^[A-Z2-7]+=*$/i

// Validate Base32 string
function isValidBase32(str: string): boolean {
    if (!str || str.length === 0) return false

    // Remove spaces and convert to uppercase for validation
    const cleaned = str.replace(/\s/g, '').toUpperCase()

    // Check if string matches Base32 pattern
    if (!BASE32_CHARS.test(cleaned)) return false

    // Check for valid length (must be multiple of 8, or have valid padding)
    const unpadded = cleaned.replace(/=+$/, '')
    const paddingLength = cleaned.length - unpadded.length

    // Valid Base32 can have 0, 1, 3, 4, or 6 padding characters
    if (![0, 1, 3, 4, 6].includes(paddingLength)) {
        // If no explicit padding, check if length is valid
        if (paddingLength === 0 && cleaned.length % 8 !== 0) {
            // Allow unpadded strings of valid lengths
            const remainder = unpadded.length % 8
            if (![0, 2, 4, 5, 7].includes(remainder)) return false
        }
    }

    return unpadded.length > 0
}

// Clean and normalize Base32 input
function normalizeBase32(str: string): string {
    return str.replace(/\s/g, '').toUpperCase()
}

// Generate TOTP code
function generateTotp(secret: string): string {
    try {
        const normalized = normalizeBase32(secret)
        return totp.generate(normalized)
    } catch {
        return ''
    }
}

// Get remaining seconds in current period
function getRemainingSeconds(): number {
    return 30 - (Math.floor(Date.now() / 1000) % 30)
}

export function TotpGenerator() {
    const [secret, setSecret] = useState('')
    const [code, setCode] = useState('')
    const [remainingSeconds, setRemainingSeconds] = useState(30)
    const [error, setError] = useState('')
    const [copied, setCopied] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)

    const inputRef = useRef<HTMLInputElement>(null)
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const copiedTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Generate code and start timer
    const generateCode = useCallback(() => {
        if (!secret) {
            setCode('')
            setError('')
            return
        }

        const normalized = normalizeBase32(secret)

        if (!isValidBase32(normalized)) {
            setCode('')
            setError('Invalid Base32 secret. Use only A-Z and 2-7.')
            return
        }

        setError('')
        setIsGenerating(true)

        try {
            const newCode = generateTotp(normalized)
            if (newCode) {
                setCode(newCode)
            } else {
                setError('Failed to generate code. Check your secret.')
                setCode('')
            }
        } catch {
            setError('Failed to generate code. Check your secret.')
            setCode('')
        }

        // Brief animation state
        setTimeout(() => setIsGenerating(false), 150)
    }, [secret])

    // Update timer and regenerate at boundary
    useEffect(() => {
        const updateTimer = () => {
            const remaining = getRemainingSeconds()
            setRemainingSeconds(remaining)

            // Regenerate code at the boundary (when remaining resets to 30)
            if (remaining === 30 && secret && isValidBase32(normalizeBase32(secret))) {
                generateCode()
            }
        }

        // Initial update
        updateTimer()
        generateCode()

        // Set up interval to update every 100ms for smooth countdown
        timerRef.current = setInterval(updateTimer, 100)

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current)
            }
        }
    }, [secret, generateCode])

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSecret(value)
        setCopied(false)
    }

    // Copy to clipboard
    const copyToClipboard = async () => {
        if (!code) return

        try {
            await navigator.clipboard.writeText(code)
            setCopied(true)

            // Clear previous timeout
            if (copiedTimeoutRef.current) {
                clearTimeout(copiedTimeoutRef.current)
            }

            // Reset copied state after 2 seconds
            copiedTimeoutRef.current = setTimeout(() => {
                setCopied(false)
            }, 2000)
        } catch {
            // Fallback for older browsers
            const textArea = document.createElement('textarea')
            textArea.value = code
            document.body.appendChild(textArea)
            textArea.select()
            document.execCommand('copy')
            document.body.removeChild(textArea)
            setCopied(true)

            copiedTimeoutRef.current = setTimeout(() => {
                setCopied(false)
            }, 2000)
        }
    }

    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            if (copiedTimeoutRef.current) {
                clearTimeout(copiedTimeoutRef.current)
            }
        }
    }, [])

    // Calculate progress percentage (inverted for countdown effect)
    const progressPercentage = (remainingSeconds / 30) * 100

    // Determine if we're in the "warning" zone (last 5 seconds)
    const isWarning = remainingSeconds <= 5

    return (
        <div className="card p-6 sm:p-8">
            {/* Secret Input Section */}
            <div className="mb-6">
                <label
                    htmlFor="secret-input"
                    className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                >
                    Base32 Secret Key
                </label>
                <div className="relative">
                    <input
                        ref={inputRef}
                        id="secret-input"
                        type="text"
                        value={secret}
                        onChange={handleInputChange}
                        placeholder="Enter your Base32 secret..."
                        className={`input-field font-mono text-sm pr-10 ${
                            error ? 'border-red-500 dark:border-red-400 focus:ring-red-500' : ''
                        }`}
                        autoComplete="off"
                        autoCapitalize="characters"
                        spellCheck={false}
                        aria-describedby={error ? 'secret-error' : 'secret-hint'}
                        aria-invalid={!!error}
                    />
                    {secret && (
                        <button
                            type="button"
                            onClick={() => {
                                setSecret('')
                                setCode('')
                                setError('')
                                inputRef.current?.focus()
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                            aria-label="Clear secret"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <p
                        id="secret-error"
                        role="alert"
                        className="mt-2 text-sm text-red-500 dark:text-red-400 flex items-center gap-1"
                    >
                        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </p>
                )}

                {/* Hint */}
                {!error && (
                    <p id="secret-hint" className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                        Characters A-Z and 2-7 only. Spaces are ignored.
                    </p>
                )}
            </div>

            {/* TOTP Display Section */}
            <div
                className={`transition-all duration-300 ${
                    code ? 'opacity-100' : 'opacity-40'
                }`}
                aria-live="polite"
                aria-atomic="true"
            >
                {/* Code Display */}
                <div className="flex justify-center gap-2 sm:gap-3 mb-4">
                    {(code || '------').split('').map((digit, index) => (
                        <span
                            key={index}
                            className={`totp-digit ${
                                isGenerating ? 'scale-95 opacity-70' : 'scale-100 opacity-100'
                            } ${code ? 'text-neutral-900 dark:text-neutral-50' : 'text-neutral-400 dark:text-neutral-600'}`}
                            aria-hidden={!code}
                        >
              {digit}
            </span>
                    ))}
                </div>

                {/* Screen reader announcement */}
                <span className="sr-only">
          {code ? `Current TOTP code is ${code.split('').join(' ')}` : 'Enter a secret to generate a code'}
        </span>

                {/* Timer Section */}
                <div className="space-y-3">
                    {/* Progress Bar */}
                    <div className="relative h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                        <div
                            className={`absolute inset-y-0 left-0 rounded-full transition-all duration-100 ${
                                isWarning
                                    ? 'bg-amber-500 dark:bg-amber-400'
                                    : 'bg-blue-500 dark:bg-blue-400'
                            }`}
                            style={{ width: `${progressPercentage}%` }}
                            role="progressbar"
                            aria-valuenow={remainingSeconds}
                            aria-valuemin={0}
                            aria-valuemax={30}
                            aria-label={`${remainingSeconds} seconds remaining`}
                        />
                    </div>

                    {/* Timer Text */}
                    <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500 dark:text-neutral-400">
              Refreshes in
            </span>
                        <span
                            className={`font-mono font-medium tabular-nums ${
                                isWarning
                                    ? 'text-amber-600 dark:text-amber-400'
                                    : 'text-neutral-700 dark:text-neutral-300'
                            }`}
                        >
              {remainingSeconds}s
            </span>
                    </div>
                </div>

                {/* Copy Button */}
                <button
                    type="button"
                    onClick={copyToClipboard}
                    disabled={!code}
                    className={`btn-primary w-full mt-6 gap-2 ${
                        copied ? 'bg-green-500 hover:bg-green-500 dark:bg-green-500' : ''
                    }`}
                    aria-label={copied ? 'Copied to clipboard' : 'Copy code to clipboard'}
                >
                    {copied ? (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Copied!
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                            Copy Code
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}