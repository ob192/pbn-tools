'use client';

import { useResumeStore } from '@/store/useResumeStore';
import {
    User,
    MapPin,
    Mail,
    Phone,
    Globe,
    Briefcase,
    Trash2,
} from 'lucide-react';

const ICONS = {
    Mail,
    Phone,
    Globe,
    Briefcase,
};

type IconKey = keyof typeof ICONS;

export function WhoContactsStep() {
    const { resume, setWho, updateContact, removeContact } =
        useResumeStore();

    return (
        <div className="space-y-8 pb-32">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    Personal Information
                </h2>
                <p className="text-gray-600">
                    Tell us about yourself and how to reach you
                </p>
                <p className="text-sm text-gray-500 mt-2">
                    This helps recruiters put a face to the name — keep it simple and clear.
                </p>
            </div>

            {/* About You */}
            <section className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                    <User size={18} /> About You
                </h3>

                <input
                    className="input"
                    placeholder="Full name (as it appears on your CV)"
                    value={resume.who.fullName}
                    onChange={(e) =>
                        setWho({ ...resume.who, fullName: e.target.value })
                    }
                />

                <input
                    className="input"
                    placeholder="Professional title (e.g. Frontend Developer)"
                    value={resume.who.title}
                    onChange={(e) =>
                        setWho({ ...resume.who, title: e.target.value })
                    }
                />

                {/* Location */}
                <div className="flex items-center gap-3 rounded-lg border border-gray-300 px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500">
                    <MapPin size={18} className="text-gray-400 shrink-0" />
                    <input
                        className="w-full bg-transparent outline-none"
                        placeholder="City, Country (optional)"
                        value={resume.who.location}
                        onChange={(e) =>
                            setWho({ ...resume.who, location: e.target.value })
                        }
                    />
                </div>

                {/* Gentle encouragement */}
                {resume.who.fullName && resume.who.title && (
                    <p className="text-sm text-emerald-600">
                        Nice — this already looks solid 👍
                    </p>
                )}
            </section>

            {/* Contacts */}
            <section className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                    <Mail size={18} /> Contact Information
                </h3>

                {resume.contacts.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed rounded-xl">
                        <Mail size={36} className="mx-auto mb-2 text-gray-400" />
                        <p className="text-gray-500 text-sm">
                            Add at least one way for recruiters to reach you
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            Email is usually enough to start
                        </p>
                    </div>
                )}

                {resume.contacts.map((contact) => (
                    <div
                        key={contact.id}
                        className="border rounded-xl p-4 space-y-4"
                    >
                        {/* Icon picker */}
                        <div className="flex gap-2 flex-wrap">
                            {Object.entries(ICONS).map(([key, Icon]) => (
                                <button
                                    key={key}
                                    onClick={() =>
                                        updateContact(contact.id, {
                                            icon: key as IconKey,
                                        })
                                    }
                                    className={`p-2 rounded-lg border transition ${
                                        contact.icon === key
                                            ? 'bg-blue-50 border-blue-600'
                                            : 'border-gray-200'
                                    }`}
                                    aria-label={`Use ${key} icon`}
                                >
                                    <Icon size={18} />
                                </button>
                            ))}
                        </div>

                        <input
                            className="input"
                            placeholder="Label (e.g. Email, LinkedIn)"
                            value={contact.label}
                            onChange={(e) =>
                                updateContact(contact.id, {
                                    label: e.target.value,
                                })
                            }
                        />

                        <input
                            className="input"
                            placeholder="Value (e.g. you@email.com)"
                            value={contact.value}
                            onChange={(e) =>
                                updateContact(contact.id, {
                                    value: e.target.value,
                                })
                            }
                        />

                        <button
                            onClick={() => removeContact(contact.id)}
                            className="text-sm text-red-600 flex items-center gap-2 hover:underline"
                        >
                            <Trash2 size={16} />
                            Remove contact
                        </button>
                    </div>
                ))}
            </section>

            {/* Reassurance */}
            <p className="text-xs text-gray-400 text-center">
                You can change or update this anytime later
            </p>
        </div>
    );
}
