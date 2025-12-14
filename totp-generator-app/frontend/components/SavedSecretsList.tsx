'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import {
    getAllSecrets,
    deleteSecret,
    toggleFavorite,
    encodeSecretForUrl,
    type SavedSecret
} from '@/lib/db';

const COLOR_MAP: Record<string, string> = {
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    amber: 'bg-amber-500',
    green: 'bg-emerald-500',
    teal: 'bg-teal-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
};

interface SavedSecretsListProps {
    onSelect: (secret: SavedSecret) => void;
    onEdit: (secret: SavedSecret) => void;
    currentSecret?: string;
    refreshTrigger?: number;
}

export function SavedSecretsList({
                                     onSelect,
                                     onEdit,
                                     currentSecret,
                                     refreshTrigger
                                 }: SavedSecretsListProps) {
    const t = useTranslations('savedSecrets');
    const [secrets, setSecrets] = useState<SavedSecret[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const [copiedShareId, setCopiedShareId] = useState<string | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    const loadSecrets = useCallback(async () => {
        setIsLoading(true);
        const loaded = await getAllSecrets();
        setSecrets(loaded);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        loadSecrets();
    }, [loadSecrets, refreshTrigger]);

    const handleDelete = async (id: string) => {
        await deleteSecret(id);
        setDeleteConfirmId(null);
        loadSecrets();
    };

    const handleToggleFavorite = async (id: string) => {
        await toggleFavorite(id);
        loadSecrets();
    };

    const handleShare = async (secret: SavedSecret) => {
        const baseUrl = window.location.origin + window.location.pathname;
        const shareUrl = `${baseUrl}?s=${encodeSecretForUrl(secret.secret)}`;

        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopiedShareId(secret.id);
            setTimeout(() => setCopiedShareId(null), 2000);
        } catch {
            // Fallback
            const textArea = document.createElement('textarea');
            textArea.value = shareUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopiedShareId(secret.id);
            setTimeout(() => setCopiedShareId(null), 2000);
        }
    };

    const normalizedCurrent = currentSecret?.replace(/\s/g, '').toUpperCase();

    if (isLoading) {
        return (
            <div className="mt-4 p-4 rounded-xl bg-neutral-900/50 border border-neutral-800">
                <div className="flex items-center gap-2 text-neutral-400 text-sm">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {t('loading')}
                </div>
            </div>
        );
    }

    if (secrets.length === 0) {
        return null;
    }

    return (
        <div className="mt-4">
            {/* Toggle header */}
            <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:bg-neutral-900/70 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span className="text-sm font-medium text-neutral-200">
            {t('savedCount', { count: secrets.length })}
          </span>
                </div>
                <svg
                    className={`w-4 h-4 text-neutral-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Secrets list */}
            {isExpanded && (
                <div className="mt-2 space-y-2 max-h-80 overflow-y-auto pr-1">
                    {secrets.map((secret) => {
                        const isActive = secret.secret === normalizedCurrent;
                        const colorClass = secret.color ? COLOR_MAP[secret.color] : 'bg-neutral-600';

                        return (
                            <div
                                key={secret.id}
                                className={`relative rounded-xl border transition-all ${
                                    isActive
                                        ? 'bg-emerald-950/30 border-emerald-700/50'
                                        : 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-700'
                                }`}
                            >
                                {/* Delete confirmation overlay */}
                                {deleteConfirmId === secret.id && (
                                    <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 bg-neutral-900/95 rounded-xl">
                                        <span className="text-xs text-neutral-300">{t('confirmDelete')}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(secret.id)}
                                            className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors"
                                        >
                                            {t('delete')}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDeleteConfirmId(null)}
                                            className="px-3 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors"
                                        >
                                            {t('cancel')}
                                        </button>
                                    </div>
                                )}

                                <div className="p-3">
                                    {/* Header row */}
                                    <div className="flex items-start gap-2 mb-2">
                                        {/* Color indicator */}
                                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${colorClass}`} />

                                        {/* Title & favorite */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <h4 className="text-sm font-medium text-neutral-100 truncate">
                                                    {secret.title}
                                                </h4>
                                                {secret.isFavorite && (
                                                    <svg className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                )}
                                                {isActive && (
                                                    <span className="text-[10px] font-medium text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                            {t('active')}
                          </span>
                                                )}
                                            </div>
                                            {secret.notes && (
                                                <p className="text-xs text-neutral-500 truncate mt-0.5">
                                                    {secret.notes}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions row */}
                                    <div className="flex items-center gap-1.5">
                                        {/* Select button */}
                                        <button
                                            type="button"
                                            onClick={() => onSelect(secret)}
                                            disabled={isActive}
                                            className={`flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                                isActive
                                                    ? 'text-emerald-400 bg-emerald-400/10 cursor-default'
                                                    : 'text-neutral-300 bg-neutral-800 hover:bg-neutral-700'
                                            }`}
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            {isActive ? t('using') : t('use')}
                                        </button>

                                        {/* Share button */}
                                        <button
                                            type="button"
                                            onClick={() => handleShare(secret)}
                                            className={`flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                                copiedShareId === secret.id
                                                    ? 'text-emerald-400 bg-emerald-400/10'
                                                    : 'text-neutral-400 bg-neutral-800 hover:bg-neutral-700 hover:text-neutral-200'
                                            }`}
                                            aria-label={t('shareAria')}
                                        >
                                            {copiedShareId === secret.id ? (
                                                <>
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    {t('copied')}
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                                    </svg>
                                                    {t('share')}
                                                </>
                                            )}
                                        </button>

                                        {/* Favorite toggle */}
                                        <button
                                            type="button"
                                            onClick={() => handleToggleFavorite(secret.id)}
                                            className={`p-1.5 rounded-lg transition-colors ${
                                                secret.isFavorite
                                                    ? 'text-amber-400 bg-amber-400/10 hover:bg-amber-400/20'
                                                    : 'text-neutral-500 bg-neutral-800 hover:bg-neutral-700 hover:text-amber-400'
                                            }`}
                                            aria-label={secret.isFavorite ? t('unfavorite') : t('favorite')}
                                        >
                                            <svg className="w-3.5 h-3.5" fill={secret.isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                            </svg>
                                        </button>

                                        {/* Edit button */}
                                        <button
                                            type="button"
                                            onClick={() => onEdit(secret)}
                                            className="p-1.5 text-neutral-500 bg-neutral-800 hover:bg-neutral-700 hover:text-neutral-200 rounded-lg transition-colors"
                                            aria-label={t('edit')}
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>

                                        {/* Delete button */}
                                        <button
                                            type="button"
                                            onClick={() => setDeleteConfirmId(secret.id)}
                                            className="p-1.5 text-neutral-500 bg-neutral-800 hover:bg-red-900/50 hover:text-red-400 rounded-lg transition-colors"
                                            aria-label={t('deleteAria')}
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}