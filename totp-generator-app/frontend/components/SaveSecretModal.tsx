'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import type { SavedSecret, NewSecret } from '@/lib/db';

const COLORS = [
    { id: 'default', class: 'bg-neutral-600' },
    { id: 'red', class: 'bg-red-500' },
    { id: 'orange', class: 'bg-orange-500' },
    { id: 'amber', class: 'bg-amber-500' },
    { id: 'green', class: 'bg-emerald-500' },
    { id: 'teal', class: 'bg-teal-500' },
    { id: 'blue', class: 'bg-blue-500' },
    { id: 'purple', class: 'bg-purple-500' },
    { id: 'pink', class: 'bg-pink-500' },
];

interface SaveSecretModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: NewSecret) => void;
    secret: string;
    existingSecret?: SavedSecret | null;
}

export function SaveSecretModal({
                                    isOpen,
                                    onClose,
                                    onSave,
                                    secret,
                                    existingSecret
                                }: SaveSecretModalProps) {
    const t = useTranslations('savedSecrets');
    const titleRef = useRef<HTMLInputElement>(null);

    const [title, setTitle] = useState('');
    const [notes, setNotes] = useState('');
    const [color, setColor] = useState('default');
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (existingSecret) {
                setTitle(existingSecret.title);
                setNotes(existingSecret.notes || '');
                setColor(existingSecret.color || 'default');
                setIsFavorite(existingSecret.isFavorite);
            } else {
                setTitle('');
                setNotes('');
                setColor('default');
                setIsFavorite(false);
            }
            setTimeout(() => titleRef.current?.focus(), 100);
        }
    }, [isOpen, existingSecret]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        onSave({
            title: title.trim(),
            secret: secret.replace(/\s/g, '').toUpperCase(),
            notes: notes.trim() || undefined,
            color: color === 'default' ? undefined : color,
            isFavorite,
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
                    <h2 id="modal-title" className="text-lg font-semibold text-neutral-50">
                        {existingSecret ? t('editTitle') : t('saveTitle')}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-neutral-400 hover:text-neutral-200 transition-colors"
                        aria-label={t('close')}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {/* Title */}
                    <div>
                        <label htmlFor="secret-title" className="block text-xs font-medium text-neutral-300 mb-1.5">
                            {t('titleLabel')} *
                        </label>
                        <input
                            ref={titleRef}
                            id="secret-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder={t('titlePlaceholder')}
                            className="input-field text-sm"
                            required
                            maxLength={50}
                        />
                    </div>

                    {/* Secret (read-only display) */}
                    <div>
                        <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                            {t('secretLabel')}
                        </label>
                        <div className="px-3 py-2 bg-neutral-800 rounded-lg font-mono text-xs text-neutral-400 break-all">
                            {secret.replace(/\s/g, '').toUpperCase()}
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label htmlFor="secret-notes" className="block text-xs font-medium text-neutral-300 mb-1.5">
                            {t('notesLabel')}
                        </label>
                        <textarea
                            id="secret-notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder={t('notesPlaceholder')}
                            className="input-field text-sm resize-none h-20"
                            maxLength={200}
                        />
                    </div>

                    {/* Color picker */}
                    <div>
                        <label className="block text-xs font-medium text-neutral-300 mb-2">
                            {t('colorLabel')}
                        </label>
                        <div className="flex gap-2 flex-wrap">
                            {COLORS.map((c) => (
                                <button
                                    key={c.id}
                                    type="button"
                                    onClick={() => setColor(c.id)}
                                    className={`w-7 h-7 rounded-full ${c.class} transition-all ${
                                        color === c.id
                                            ? 'ring-2 ring-offset-2 ring-offset-neutral-900 ring-white scale-110'
                                            : 'hover:scale-105'
                                    }`}
                                    aria-label={c.id}
                                    aria-pressed={color === c.id}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Favorite toggle */}
                    <label className="flex items-center gap-3 cursor-pointer">
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={isFavorite}
                                onChange={(e) => setIsFavorite(e.target.checked)}
                                className="sr-only"
                            />
                            <div className={`w-10 h-6 rounded-full transition-colors ${
                                isFavorite ? 'bg-amber-500' : 'bg-neutral-700'
                            }`}>
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                                    isFavorite ? 'translate-x-5' : 'translate-x-1'
                                }`} />
                            </div>
                        </div>
                        <span className="text-sm text-neutral-300">{t('favoriteLabel')}</span>
                    </label>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 text-sm font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 rounded-xl transition-colors"
                        >
                            {t('cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={!title.trim()}
                            className="flex-1 btn-primary"
                        >
                            {existingSecret ? t('update') : t('save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}