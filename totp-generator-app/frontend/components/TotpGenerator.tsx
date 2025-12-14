'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { authenticator } from 'otplib';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { SaveSecretModal } from './SaveSecretModal';
import { SavedSecretsList } from './SavedSecretsList';
import {
    saveSecret,
    updateSecret,
    findSecretByValue,
    decodeSecretFromUrl,
    encodeSecretForUrl,
    type SavedSecret,
    type NewSecret
} from '@/lib/db';

// Configure standard 30s / 6-digit TOTP
authenticator.options = {
    ...authenticator.options,
    step: 30,
    digits: 6
};

// Base32 character set (RFC 4648)
const BASE32_CHARS = /^[A-Z2-7]+=*$/i;

// Validate Base32 string
function isValidBase32(str: string): boolean {
    if (!str || str.length === 0) return false;

    const cleaned = str.replace(/\s/g, '').toUpperCase();

    if (!BASE32_CHARS.test(cleaned)) return false;

    const unpadded = cleaned.replace(/=+$/, '');
    const paddingLength = cleaned.length - unpadded.length;

    if (![0, 1, 3, 4, 6].includes(paddingLength)) {
        if (paddingLength === 0 && cleaned.length % 8 !== 0) {
            const remainder = unpadded.length % 8;
            if (![0, 2, 4, 5, 7].includes(remainder)) return false;
        }
    }

    return unpadded.length > 0;
}

// Clean and normalize Base32 input
function normalizeBase32(str: string): string {
    return str.replace(/\s/g, '').toUpperCase();
}

// Generate TOTP code using authenticator (Base32 secret)
function generateTotp(secret: string): string {
    try {
        return authenticator.generate(secret);
    } catch {
        return '';
    }
}

// Get remaining seconds in current period (from authenticator)
function getRemainingSeconds(): number {
    return authenticator.timeRemaining();
}

export function TotpGenerator() {
    const t = useTranslations('totp');
    const tSaved = useTranslations('savedSecrets');
    const searchParams = useSearchParams();

    const [secret, setSecret] = useState('');
    const [code, setCode] = useState('');
    const [remainingSeconds, setRemainingSeconds] = useState(30);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    // Modal & saved secrets state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSecret, setEditingSecret] = useState<SavedSecret | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [shareCopied, setShareCopied] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const copiedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const shareTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const initializedRef = useRef(false);

    // Load secret from URL on mount
    useEffect(() => {
        if (initializedRef.current) return;
        initializedRef.current = true;

        const urlSecret = searchParams.get('s');
        if (urlSecret) {
            const decoded = decodeSecretFromUrl(urlSecret);
            if (isValidBase32(decoded)) {
                setSecret(decoded);
                // Clean up URL without reload
                const newUrl = window.location.pathname;
                window.history.replaceState({}, '', newUrl);
            }
        }
    }, [searchParams]);

    const generateCode = useCallback(() => {
        if (!secret) {
            setCode('');
            setError('');
            return;
        }

        const normalized = normalizeBase32(secret);

        if (!isValidBase32(normalized)) {
            setCode('');
            setError(t('invalidBase32'));
            return;
        }

        setError('');
        setIsGenerating(true);

        try {
            const newCode = generateTotp(normalized);
            if (newCode) {
                setCode(newCode);
            } else {
                setError(t('generateError'));
                setCode('');
            }
        } catch {
            setError(t('generateError'));
            setCode('');
        }

        setTimeout(() => setIsGenerating(false), 150);
    }, [secret, t]);

    useEffect(() => {
        const updateTimer = () => {
            const remaining = getRemainingSeconds();
            setRemainingSeconds(remaining);

            if (
                remaining === 30 &&
                secret &&
                isValidBase32(normalizeBase32(secret))
            ) {
                generateCode();
            }
        };

        updateTimer();
        generateCode();

        timerRef.current = setInterval(updateTimer, 1000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [secret, generateCode]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSecret(value);
        setCopied(false);
    };

    const copyToClipboard = async () => {
        if (!code) return;

        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);

            if (copiedTimeoutRef.current) {
                clearTimeout(copiedTimeoutRef.current);
            }

            copiedTimeoutRef.current = setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch {
            const textArea = document.createElement('textarea');
            textArea.value = code;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);

            copiedTimeoutRef.current = setTimeout(() => {
                setCopied(false);
            }, 2000);
        }
    };

    const handleShareLink = async () => {
        if (!secret || !isValidBase32(normalizeBase32(secret))) return;

        const baseUrl = window.location.origin + window.location.pathname;
        const shareUrl = `${baseUrl}?s=${encodeSecretForUrl(secret)}`;

        try {
            await navigator.clipboard.writeText(shareUrl);
            setShareCopied(true);

            if (shareTimeoutRef.current) {
                clearTimeout(shareTimeoutRef.current);
            }

            shareTimeoutRef.current = setTimeout(() => {
                setShareCopied(false);
            }, 2000);
        } catch {
            const textArea = document.createElement('textarea');
            textArea.value = shareUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setShareCopied(true);

            shareTimeoutRef.current = setTimeout(() => {
                setShareCopied(false);
            }, 2000);
        }
    };

    const handleSaveSecret = async (data: NewSecret) => {
        if (editingSecret) {
            await updateSecret(editingSecret.id, data);
        } else {
            await saveSecret(data);
        }
        setEditingSecret(null);
        setRefreshTrigger(prev => prev + 1);
    };

    const handleSelectSecret = (savedSecret: SavedSecret) => {
        setSecret(savedSecret.secret);
        setCopied(false);
    };

    const handleEditSecret = (savedSecret: SavedSecret) => {
        setEditingSecret(savedSecret);
        setIsModalOpen(true);
    };

    const handleOpenSaveModal = async () => {
        if (!secret || !isValidBase32(normalizeBase32(secret))) return;

        // Check if this secret is already saved
        const existing = await findSecretByValue(secret);
        if (existing) {
            setEditingSecret(existing);
        } else {
            setEditingSecret(null);
        }
        setIsModalOpen(true);
    };

    useEffect(() => {
        return () => {
            if (copiedTimeoutRef.current) {
                clearTimeout(copiedTimeoutRef.current);
            }
            if (shareTimeoutRef.current) {
                clearTimeout(shareTimeoutRef.current);
            }
        };
    }, []);

    const progressPercentage = (remainingSeconds / 30) * 100;
    const isWarning = remainingSeconds <= 5;
    const isEmptyState = !secret && !error;
    const canSaveOrShare = secret && isValidBase32(normalizeBase32(secret));

    return (
        <>
            <div className="card p-4 sm:p-5 md:p-6">
                {/* Secret Input Section */}
                <div className="mb-5 sm:mb-6">
                    <label
                        htmlFor="secret-input"
                        className="block text-xs sm:text-sm font-medium text-neutral-200 mb-2"
                    >
                        {t('secretLabel')}
                    </label>
                    <div className="relative">
                        <input
                            ref={inputRef}
                            id="secret-input"
                            type="text"
                            value={secret}
                            onChange={handleInputChange}
                            placeholder={t('secretPlaceholder')}
                            className={`input-field font-mono text-xs sm:text-sm pr-10 transition-colors transition-shadow ${
                                error
                                    ? 'input-field-error'
                                    : isEmptyState
                                        ? 'border-emerald-500/60 shadow-[0_0_0_1px_rgba(16,185,129,0.4)] bg-neutral-900/60'
                                        : ''
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
                                    setSecret('');
                                    setCode('');
                                    setError('');
                                    inputRef.current?.focus();
                                }}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                                aria-label={t('clearSecretAria')}
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>

                    {error && (
                        <p
                            id="secret-error"
                            role="alert"
                            className="mt-1.5 text-xs text-red-400 flex items-center gap-1.5"
                        >
                            <svg
                                className="w-3.5 h-3.5 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M18 10A8 8 0 11.001 9.999 8 8 0 0118 10zm-8 3a1 1 0 100 2 1 1 0 000-2zm1-7a1 1 0 10-2 0v4a1 1 0 102 0V6z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            {error}
                        </p>
                    )}

                    {!error && (
                        <p
                            id="secret-hint"
                            className="mt-1.5 text-[11px] text-neutral-500"
                        >
                            {t('secretHint')}
                        </p>
                    )}

                    {/* Save & Share buttons */}
                    {canSaveOrShare && (
                        <div className="flex gap-2 mt-3">
                            <button
                                type="button"
                                onClick={handleOpenSaveModal}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                                {tSaved('saveButton')}
                            </button>

                            <button
                                type="button"
                                onClick={handleShareLink}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                    shareCopied
                                        ? 'text-emerald-400 bg-emerald-400/10'
                                        : 'text-neutral-300 bg-neutral-800 hover:bg-neutral-700'
                                }`}
                            >
                                {shareCopied ? (
                                    <>
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {tSaved('linkCopied')}
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                        </svg>
                                        {tSaved('shareLink')}
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {/* TOTP Display */}
                <div
                    className={`transition-opacity duration-200 ${
                        code ? 'opacity-100' : 'opacity-40'
                    }`}
                    aria-live="polite"
                    aria-atomic="true"
                >
                    <div className="flex justify-center gap-1.5 sm:gap-2 mb-4">
                        {(code || '------')
                            .split('')
                            .map((digit, index) => (
                                <span
                                    key={index}
                                    className={`totp-digit ${
                                        isGenerating ? 'totp-digit-generating' : 'totp-digit-idle'
                                    } ${code ? 'text-neutral-50' : 'text-neutral-600'}`}
                                    aria-hidden={!code}
                                >
                  {digit}
                </span>
                            ))}
                    </div>

                    <span className="sr-only">
            {code
                ? t('codeSr', { code: code.split('').join(' ') })
                : t('enterSecretSr')}
          </span>

                    {/* Timer */}
                    <div className="space-y-2.5">
                        <div className="relative h-2 rounded-full overflow-hidden bg-neutral-800">
                            <div
                                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-150 ${
                                    isWarning ? 'bg-amber-400' : 'bg-emerald-400'
                                }`}
                                style={{ width: `${progressPercentage}%` }}
                                role="progressbar"
                                aria-valuenow={remainingSeconds}
                                aria-valuemin={0}
                                aria-valuemax={30}
                                aria-label={t('timerAria', { seconds: remainingSeconds })}
                            />
                        </div>

                        <div className="flex items-center justify-between text-xs sm:text-sm text-neutral-400">
                            <span>{t('codeRefreshLabel')}</span>
                            <span
                                className={`font-mono font-medium tabular-nums ${
                                    isWarning ? 'text-amber-300' : 'text-neutral-200'
                                }`}
                            >
                {remainingSeconds}s
              </span>
                        </div>
                    </div>

                    {/* Copy button */}
                    <button
                        type="button"
                        onClick={copyToClipboard}
                        disabled={!code}
                        className={`btn-primary w-full mt-5 gap-2 ${
                            copied ? 'btn-primary-success' : ''
                        }`}
                        aria-label={
                            copied
                                ? t('copiedAria')
                                : t('copyAria')
                        }
                    >
                        {copied ? (
                            <>
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                                {t('copied')}
                            </>
                        ) : (
                            <>
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                                    />
                                </svg>
                                {t('copy')}
                            </>
                        )}
                    </button>
                </div>

                {/* Saved Secrets List */}
                <SavedSecretsList
                    onSelect={handleSelectSecret}
                    onEdit={handleEditSecret}
                    currentSecret={secret}
                    refreshTrigger={refreshTrigger}
                />
            </div>

            {/* Save/Edit Modal */}
            <SaveSecretModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingSecret(null);
                }}
                onSave={handleSaveSecret}
                secret={secret}
                existingSecret={editingSecret}
            />
        </>
    );
}