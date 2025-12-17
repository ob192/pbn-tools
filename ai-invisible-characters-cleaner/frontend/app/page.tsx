// app/page.tsx
"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { cleanText, CleanResult } from "@/lib/clean-text";

// Types for detected characters (matching clean-text.ts exports)
interface DetectedChar {
    codePoint: number;
    codePointHex: string;
    position: number;
    line: number;
    column: number;
    name: string;
    category: string;
    aiWatermarkRisk: 'high' | 'medium' | 'low';
}

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "What are invisible Unicode characters?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Invisible Unicode characters are non-printable characters that exist in text but don't display visually. Common examples include Zero-Width Space (U+200B), Zero-Width Non-Joiner (U+200C), Zero-Width Joiner (U+200D), and Byte Order Mark (U+FEFF). These characters are part of the Unicode Cf (Format) category.",
            },
        },
        {
            "@type": "Question",
            name: "Why do AI tools add invisible characters to text?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "AI tools often embed invisible Unicode characters as watermarks to track and identify AI-generated content. These hidden markers allow companies to detect when their AI's output is being used, even after the text has been copied and pasted elsewhere.",
            },
        },
        {
            "@type": "Question",
            name: "How do I remove invisible characters from AI-generated text?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Use Clean & Paste, a free invisible character cleaner. Simply paste your AI text into the input field, click the 'Clean & Paste' button, and copy the cleaned output. This removes zero width characters, byte order marks, and other hidden Unicode characters.",
            },
        },
        {
            "@type": "Question",
            name: "Is Clean & Paste free to use?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, Clean & Paste is completely free. There are no sign-ups, no limits, and no hidden fees. You can clean as much AI text as you need without any restrictions.",
            },
        },
        {
            "@type": "Question",
            name: "What invisible characters does Clean & Paste remove?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Clean & Paste removes all common invisible Unicode characters including Zero-Width Space (U+200B), Zero-Width Non-Joiner (U+200C), Zero-Width Joiner (U+200D), Byte Order Mark (U+FEFF), Word Joiner (U+2060), and all characters in the Unicode Cf (Format) category.",
            },
        },
    ],
};

const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Clean & Paste",
    description:
        "Free invisible Unicode character remover. Clean AI text from hidden watermarks and zero-width characters.",
    url: "https://promtheon.io/clean-paste",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
    },
    creator: {
        "@type": "Organization",
        name: "Vertex Media Corporation",
    },
};

const invisibleCharacters = [
    {
        code: "U+200B",
        name: "Zero-Width Space",
        description: "Invisible space with no width",
    },
    {
        code: "U+200C",
        name: "Zero-Width Non-Joiner",
        description: "Prevents character joining",
    },
    {
        code: "U+200D",
        name: "Zero-Width Joiner",
        description: "Joins characters together",
    },
    {
        code: "U+FEFF",
        name: "Byte Order Mark (BOM)",
        description: "Marks byte order in text",
    },
    {
        code: "U+2060",
        name: "Word Joiner",
        description: "Prevents line breaks",
    },
    {
        code: "U+00AD",
        name: "Soft Hyphen",
        description: "Invisible hyphenation point",
    },
    {
        code: "U+034F",
        name: "Combining Grapheme Joiner",
        description: "Affects character rendering",
    },
    {
        code: "U+061C",
        name: "Arabic Letter Mark",
        description: "Controls bidirectional text",
    },
];

// Extended stats interface to include cleaning result details
interface CleanStats {
    original: number;
    cleaned: number;
    removed: number;
    normalized: number;
    detectedChars: DetectedChar[];
    verdict: 'clean' | 'suspicious' | 'likely-watermarked';
    suspicionScore: number;
    byRisk: { high: number; medium: number; low: number };
}

export default function CleanPastePage() {
    const [inputText, setInputText] = useState("");
    const [outputText, setOutputText] = useState("");
    const [isCleaning, setIsCleaning] = useState(false);
    const [copied, setCopied] = useState(false);
    const [stats, setStats] = useState<CleanStats | null>(null);

    const handleClean = useCallback(() => {
        if (!inputText.trim()) return;

        setIsCleaning(true);

        // Small delay for UX feedback
        setTimeout(() => {
            try {
                // Call the actual cleanText function from lib/clean-text.ts
                const result: CleanResult = cleanText(inputText);

                setOutputText(result.cleanedText);
                setStats({
                    original: result.originalLength,
                    cleaned: result.cleanedLength,
                    removed: result.removedCount,
                    normalized: result.normalizedCount,
                    detectedChars: result.detectedChars,
                    verdict: result.statistics.verdict,
                    suspicionScore: result.statistics.suspicionScore,
                    byRisk: result.statistics.byRisk,
                });
            } catch (error) {
                console.error("Error cleaning text:", error);
                // Fallback: return original text if cleaning fails
                setOutputText(inputText);
                setStats({
                    original: inputText.length,
                    cleaned: inputText.length,
                    removed: 0,
                    normalized: 0,
                    detectedChars: [],
                    verdict: 'clean',
                    suspicionScore: 0,
                    byRisk: { high: 0, medium: 0, low: 0 },
                });
            }
            setIsCleaning(false);
        }, 300);
    }, [inputText]);

    const handleCopy = useCallback(async () => {
        if (outputText) {
            try {
                await navigator.clipboard.writeText(outputText);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error("Failed to copy text:", err);
            }
        }
    }, [outputText]);

    const handleClear = useCallback(() => {
        setInputText("");
        setOutputText("");
        setStats(null);
    }, []);

    const handlePaste = useCallback(async () => {
        try {
            const text = await navigator.clipboard.readText();
            setInputText(text);
        } catch (err) {
            console.error("Failed to paste text:", err);
        }
    }, []);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
            />

            <div className="min-h-screen bg-white text-neutral-900">
                {/* Navigation */}
                <nav className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-md">
                    <div className="mx-auto max-w-6xl px-4 py-4">
                        <div className="flex items-center justify-between">
                            <Link href="/public" className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900">
                                    <svg
                                        className="h-6 w-6 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <span className="text-xl font-bold tracking-tight">
                                    Clean & Paste
                                </span>
                            </Link>
                            <div className="hidden items-center gap-6 md:flex">
                                <Link
                                    href="#tool"
                                    className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
                                >
                                    Tool
                                </Link>
                                <Link
                                    href="#how-it-works"
                                    className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
                                >
                                    How It Works
                                </Link>
                                <Link
                                    href="#faq"
                                    className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
                                >
                                    FAQ
                                </Link>
                                <Link
                                    href="https://promtheon.io/ai-humanizer"
                                    className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
                                >
                                    AI Humanizer
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <header className="border-b border-neutral-100 bg-gradient-to-b from-neutral-50 to-white">
                    <div className="mx-auto max-w-6xl px-4 py-16 text-center md:py-24">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                            </span>
                            Free Forever • No Sign-up Required
                        </div>

                        <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-neutral-900 md:text-5xl lg:text-6xl">
                            Clean & Paste — The Best Free
                            <br />
                            <span className="bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 bg-clip-text text-transparent">
                                Invisible Unicode Character Cleaner
                            </span>
                        </h1>

                        <p className="mx-auto mb-8 max-w-2xl text-lg text-neutral-600 md:text-xl">
                            Instantly remove invisible characters from AI-generated text. Our
                            free unicode invisible character remover cleans zero width spaces,
                            byte order marks, and hidden AI watermarks in seconds.
                        </p>

                        <p className="text-lg font-medium italic text-neutral-500">
                            Just clean and paste. Simple as that.
                        </p>

                        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                            <a
                                href="#tool"
                                className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-neutral-900/20 transition-all hover:bg-neutral-800 hover:shadow-xl"
                            >
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                    />
                                </svg>
                                Start Cleaning
                            </a>
                            <a
                                href="#how-it-works"
                                className="inline-flex items-center gap-2 rounded-xl border-2 border-neutral-200 bg-white px-8 py-4 text-lg font-semibold text-neutral-700 transition-all hover:border-neutral-300 hover:bg-neutral-50"
                            >
                                Learn More
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </a>
                        </div>
                    </div>
                </header>

                {/* Tool Section */}
                <section id="tool" className="scroll-mt-20 py-16 md:py-24">
                    <div className="mx-auto max-w-6xl px-4">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
                                Remove Invisible Characters Instantly
                            </h2>
                            <p className="mx-auto max-w-2xl text-lg text-neutral-600">
                                Paste your AI text below and click clean. Our free invisible
                                character cleaner removes all hidden unicode characters and AI
                                watermarks.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 shadow-sm md:p-8">
                            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
                                {/* Input Section */}
                                <div className="flex flex-col">
                                    <div className="mb-3 flex items-center justify-between">
                                        <label
                                            htmlFor="input-text"
                                            className="text-sm font-semibold text-neutral-700"
                                        >
                                            Paste your text
                                        </label>
                                        <button
                                            onClick={handlePaste}
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-neutral-600 shadow-sm ring-1 ring-neutral-200 transition-all hover:bg-neutral-50 hover:ring-neutral-300"
                                        >
                                            <svg
                                                className="h-3.5 w-3.5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                                />
                                            </svg>
                                            Paste
                                        </button>
                                    </div>
                                    <textarea
                                        id="input-text"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        placeholder="Paste your text here…"
                                        className="h-64 w-full resize-none rounded-xl border border-neutral-200 bg-white p-4 text-base text-neutral-900 placeholder-neutral-400 shadow-sm transition-all focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 lg:h-80"
                                    />
                                    <div className="mt-2 text-right text-xs text-neutral-400">
                                        {inputText.length.toLocaleString()} characters
                                    </div>
                                </div>

                                {/* Output Section */}
                                <div className="flex flex-col">
                                    <div className="mb-3 flex items-center justify-between">
                                        <label
                                            htmlFor="output-text"
                                            className="text-sm font-semibold text-neutral-700"
                                        >
                                            Cleaned output
                                        </label>
                                        <button
                                            onClick={handleCopy}
                                            disabled={!outputText}
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-neutral-600 shadow-sm ring-1 ring-neutral-200 transition-all hover:bg-neutral-50 hover:ring-neutral-300 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {copied ? (
                                                <>
                                                    <svg
                                                        className="h-3.5 w-3.5 text-green-600"
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
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <svg
                                                        className="h-3.5 w-3.5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                    Copy
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <textarea
                                        id="output-text"
                                        value={outputText}
                                        readOnly
                                        placeholder="Cleaned text will appear here…"
                                        className="h-64 w-full resize-none rounded-xl border border-neutral-200 bg-neutral-100 p-4 text-base text-neutral-900 placeholder-neutral-400 shadow-sm lg:h-80"
                                    />
                                    <div className="mt-2 text-right text-xs text-neutral-400">
                                        {outputText.length.toLocaleString()} characters
                                    </div>
                                </div>
                            </div>

                            {/* Stats Display */}
                            {stats && (
                                <div className="mt-6 space-y-4">
                                    {/* Verdict Badge */}
                                    <div
                                        className={`flex items-center justify-center gap-2 rounded-xl p-3 ${
                                            stats.verdict === 'clean'
                                                ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
                                                : stats.verdict === 'suspicious'
                                                    ? 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200'
                                                    : 'bg-red-50 text-red-700 ring-1 ring-red-200'
                                        }`}
                                    >
                                        {stats.verdict === 'clean' && (
                                            <>
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="font-medium">Clean — No invisible characters found</span>
                                            </>
                                        )}
                                        {stats.verdict === 'suspicious' && (
                                            <>
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                                <span className="font-medium">Suspicious — Some invisible characters detected and removed</span>
                                            </>
                                        )}
                                        {stats.verdict === 'likely-watermarked' && (
                                            <>
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="font-medium">Likely Watermarked — High concentration of hidden characters removed</span>
                                            </>
                                        )}
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="flex flex-wrap items-center justify-center gap-6 rounded-xl bg-white p-4 ring-1 ring-neutral-200">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-neutral-900">
                                                {stats.original.toLocaleString()}
                                            </div>
                                            <div className="text-xs font-medium text-neutral-500">
                                                Original
                                            </div>
                                        </div>
                                        <div className="h-8 w-px bg-neutral-200"></div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-neutral-900">
                                                {stats.cleaned.toLocaleString()}
                                            </div>
                                            <div className="text-xs font-medium text-neutral-500">
                                                Cleaned
                                            </div>
                                        </div>
                                        <div className="h-8 w-px bg-neutral-200"></div>
                                        <div className="text-center">
                                            <div className={`text-2xl font-bold ${stats.removed > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                {stats.removed.toLocaleString()}
                                            </div>
                                            <div className="text-xs font-medium text-neutral-500">
                                                Removed
                                            </div>
                                        </div>
                                        {stats.normalized > 0 && (
                                            <>
                                                <div className="h-8 w-px bg-neutral-200"></div>
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-blue-600">
                                                        {stats.normalized.toLocaleString()}
                                                    </div>
                                                    <div className="text-xs font-medium text-neutral-500">
                                                        Normalized
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        <div className="h-8 w-px bg-neutral-200"></div>
                                        <div className="text-center">
                                            <div className={`text-2xl font-bold ${
                                                stats.suspicionScore === 0 ? 'text-green-600' :
                                                    stats.suspicionScore < 30 ? 'text-yellow-600' : 'text-red-600'
                                            }`}>
                                                {stats.suspicionScore}/100
                                            </div>
                                            <div className="text-xs font-medium text-neutral-500">
                                                Suspicion Score
                                            </div>
                                        </div>
                                    </div>

                                    {/* Risk Breakdown (if any detected) */}
                                    {stats.detectedChars.length > 0 && (
                                        <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                                            <span className="text-neutral-500">Risk breakdown:</span>
                                            {stats.byRisk.high > 0 && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-red-700">
                                                    <span className="font-semibold">{stats.byRisk.high}</span> high
                                                </span>
                                            )}
                                            {stats.byRisk.medium > 0 && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-yellow-700">
                                                    <span className="font-semibold">{stats.byRisk.medium}</span> medium
                                                </span>
                                            )}
                                            {stats.byRisk.low > 0 && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-gray-700">
                                                    <span className="font-semibold">{stats.byRisk.low}</span> low
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Detected Characters Details (collapsible) */}
                                    {stats.detectedChars.length > 0 && (
                                        <details className="rounded-xl border border-neutral-200 bg-white">
                                            <summary className="cursor-pointer p-4 font-medium text-neutral-700 hover:bg-neutral-50">
                                                View Detected Characters ({stats.detectedChars.length})
                                            </summary>
                                            <div className="max-h-64 overflow-auto border-t border-neutral-200">
                                                <table className="w-full text-sm">
                                                    <thead className="sticky top-0 bg-neutral-100">
                                                    <tr>
                                                        <th className="px-4 py-2 text-left font-medium text-neutral-600">Position</th>
                                                        <th className="px-4 py-2 text-left font-medium text-neutral-600">Code Point</th>
                                                        <th className="px-4 py-2 text-left font-medium text-neutral-600">Name</th>
                                                        <th className="px-4 py-2 text-left font-medium text-neutral-600">Risk</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-neutral-100">
                                                    {stats.detectedChars.slice(0, 50).map((char, i) => (
                                                        <tr key={i} className="hover:bg-neutral-50">
                                                            <td className="px-4 py-2 font-mono text-neutral-500">
                                                                {char.line}:{char.column}
                                                            </td>
                                                            <td className="px-4 py-2">
                                                                <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono">
                                                                    {char.codePointHex}
                                                                </code>
                                                            </td>
                                                            <td className="px-4 py-2 text-neutral-700">{char.name}</td>
                                                            <td className="px-4 py-2">
                                                                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                                                        char.aiWatermarkRisk === 'high'
                                                                            ? 'bg-red-100 text-red-700'
                                                                            : char.aiWatermarkRisk === 'medium'
                                                                                ? 'bg-yellow-100 text-yellow-700'
                                                                                : 'bg-gray-100 text-gray-700'
                                                                    }`}>
                                                                        {char.aiWatermarkRisk}
                                                                    </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                                {stats.detectedChars.length > 50 && (
                                                    <p className="p-3 text-center text-sm text-neutral-500">
                                                        ... and {stats.detectedChars.length - 50} more characters
                                                    </p>
                                                )}
                                            </div>
                                        </details>
                                    )}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                                <button
                                    onClick={handleClean}
                                    disabled={!inputText.trim() || isCleaning}
                                    className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-neutral-900/20 transition-all hover:bg-neutral-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                                >
                                    {isCleaning ? (
                                        <>
                                            <svg
                                                className="h-5 w-5 animate-spin"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                            </svg>
                                            Cleaning...
                                        </>
                                    ) : (
                                        <>
                                            <svg
                                                className="h-5 w-5"
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
                                            Clean & Paste
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={handleClear}
                                    disabled={!inputText && !outputText}
                                    className="inline-flex items-center gap-2 rounded-xl border-2 border-neutral-200 bg-white px-6 py-4 text-base font-semibold text-neutral-700 transition-all hover:border-neutral-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                    Clear All
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="border-y border-neutral-100 bg-neutral-50 py-16 md:py-24">
                    <div className="mx-auto max-w-6xl px-4">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
                                Why Use Clean & Paste?
                            </h2>
                            <p className="mx-auto max-w-2xl text-lg text-neutral-600">
                                The most reliable free invisible character cleaner for removing
                                AI watermarks and hidden unicode characters.
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {[
                                {
                                    icon: (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                        />
                                    ),
                                    title: "Instant Processing",
                                    description:
                                        "Remove invisible characters in milliseconds. No waiting, no queues.",
                                },
                                {
                                    icon: (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    ),
                                    title: "100% Private",
                                    description:
                                        "Your text never touches our servers. Everything runs in your browser.",
                                },
                                {
                                    icon: (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    ),
                                    title: "Free Forever",
                                    description:
                                        "No sign-ups, no fees, no limits. Clean AI text as much as you need.",
                                },
                                {
                                    icon: (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                        />
                                    ),
                                    title: "AI Watermark Remover",
                                    description:
                                        "Detect and remove hidden AI watermarks embedded as invisible unicode.",
                                },
                                {
                                    icon: (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                                        />
                                    ),
                                    title: "Zero Width Remover",
                                    description:
                                        "Eliminate zero-width spaces, joiners, and format characters instantly.",
                                },
                                {
                                    icon: (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                                        />
                                    ),
                                    title: "Clean AI Text",
                                    description:
                                        "Sanitize text from ChatGPT, Claude, Gemini, and other AI tools.",
                                },
                            ].map((feature, index) => (
                                <div
                                    key={index}
                                    className="rounded-xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 hover:shadow-md"
                                >
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100">
                                        <svg
                                            className="h-6 w-6 text-neutral-700"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            {feature.icon}
                                        </svg>
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-neutral-900">
                                        {feature.title}
                                    </h3>
                                    <p className="text-neutral-600">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="scroll-mt-20 py-16 md:py-24">
                    <div className="mx-auto max-w-6xl px-4">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
                                What Are Invisible Unicode Characters?
                            </h2>
                            <p className="mx-auto max-w-3xl text-lg text-neutral-600">
                                Invisible Unicode characters are special non-printable
                                characters that exist in text but don&apos;t display visually.
                                They belong to the Unicode &quot;Cf&quot; (Format) category and
                                are often used by AI tools to watermark generated content.
                            </p>
                        </div>

                        {/* Character Table */}
                        <div className="mb-12 overflow-hidden rounded-xl border border-neutral-200 bg-white">
                            <div className="border-b border-neutral-200 bg-neutral-50 px-6 py-4">
                                <h3 className="text-lg font-semibold text-neutral-900">
                                    Common Invisible Characters Removed
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                    <tr className="border-b border-neutral-200 bg-neutral-50">
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                            Code Point
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                            Description
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-200">
                                    {invisibleCharacters.map((char, index) => (
                                        <tr key={index} className="hover:bg-neutral-50">
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <code className="rounded bg-neutral-100 px-2 py-1 text-sm font-mono text-neutral-700">
                                                    {char.code}
                                                </code>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-neutral-900">
                                                {char.name}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-neutral-600">
                                                {char.description}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Educational Content */}
                        <div className="grid gap-8 lg:grid-cols-2">
                            <div className="rounded-xl border border-neutral-200 bg-white p-6 md:p-8">
                                <h3 className="mb-4 text-xl font-semibold text-neutral-900">
                                    Why AI Tools Use Invisible Characters
                                </h3>
                                <p className="mb-4 text-neutral-600">
                                    AI companies embed invisible Unicode characters as watermarks
                                    to track and identify AI-generated content. These hidden
                                    markers are strategically placed within the text, allowing
                                    detection systems to identify AI output even after copying and
                                    pasting.
                                </p>
                                <ul className="space-y-2 text-neutral-600">
                                    <li className="flex items-start gap-2">
                                        <svg
                                            className="mt-1 h-4 w-4 flex-shrink-0 text-neutral-400"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Content tracking and attribution
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <svg
                                            className="mt-1 h-4 w-4 flex-shrink-0 text-neutral-400"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        AI detection by plagiarism checkers
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <svg
                                            className="mt-1 h-4 w-4 flex-shrink-0 text-neutral-400"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Fingerprinting unique outputs
                                    </li>
                                </ul>
                            </div>

                            <div className="rounded-xl border border-neutral-200 bg-white p-6 md:p-8">
                                <h3 className="mb-4 text-xl font-semibold text-neutral-900">
                                    Why You Should Clean AI Text
                                </h3>
                                <p className="mb-4 text-neutral-600">
                                    Removing invisible characters before publishing ensures your
                                    content is clean and professional. Hidden watermarks can cause
                                    unexpected issues and may flag your content as AI-generated.
                                </p>
                                <ul className="space-y-2 text-neutral-600">
                                    <li className="flex items-start gap-2">
                                        <svg
                                            className="mt-1 h-4 w-4 flex-shrink-0 text-neutral-400"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Avoid AI detection in academic settings
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <svg
                                            className="mt-1 h-4 w-4 flex-shrink-0 text-neutral-400"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Ensure clean copy for professional use
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <svg
                                            className="mt-1 h-4 w-4 flex-shrink-0 text-neutral-400"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Prevent formatting issues in publishing
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="border-y border-neutral-200 bg-gradient-to-br from-neutral-900 to-neutral-800 py-16 md:py-24">
                    <div className="mx-auto max-w-4xl px-4 text-center">
                        <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
                            Need Fully Human-Sounding Text?
                        </h2>
                        <p className="mb-8 text-lg text-neutral-300">
                            Removing invisible characters is just the first step. Our advanced
                            AI Humanizer rewrites AI-generated content to sound completely
                            natural and bypass all AI detectors.
                        </p>
                        <Link
                            href="https://promtheon.io/ai-humanizer"
                            className="inline-flex items-center gap-3 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-neutral-900 shadow-lg transition-all hover:bg-neutral-100 hover:shadow-xl"
                        >
                            Try the Advanced AI Humanizer
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                            </svg>
                        </Link>
                    </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="scroll-mt-20 py-16 md:py-24">
                    <div className="mx-auto max-w-4xl px-4">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-lg text-neutral-600">
                                Everything you need to know about removing invisible unicode
                                characters.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {faqSchema.mainEntity.map((faq, index) => (
                                <details
                                    key={index}
                                    className="group rounded-xl border border-neutral-200 bg-white"
                                >
                                    <summary className="flex cursor-pointer items-center justify-between p-6 text-left text-lg font-semibold text-neutral-900 hover:bg-neutral-50">
                                        {faq.name}
                                        <svg
                                            className="h-5 w-5 flex-shrink-0 text-neutral-400 transition-transform group-open:rotate-180"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </summary>
                                    <div className="border-t border-neutral-200 px-6 py-4 text-neutral-600">
                                        {faq.acceptedAnswer.text}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-neutral-200 bg-neutral-50">
                    <div className="mx-auto max-w-6xl px-4 py-12">
                        <div className="grid gap-8 md:grid-cols-4">
                            {/* Brand */}
                            <div className="md:col-span-2">
                                <Link href="/public" className="mb-4 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900">
                                        <svg
                                            className="h-6 w-6 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <span className="text-xl font-bold tracking-tight text-neutral-900">
                                        Clean & Paste
                                    </span>
                                </Link>
                                <p className="mb-4 max-w-sm text-neutral-600">
                                    The best free invisible unicode character remover. Clean AI
                                    text from hidden watermarks and zero-width characters
                                    instantly.
                                </p>
                                <p className="text-sm italic text-neutral-500">
                                    Just clean and paste. Simple as that.
                                </p>
                            </div>

                            {/* Resources */}
                            <div>
                                <h4 className="mb-4 font-semibold text-neutral-900">
                                    Resources
                                </h4>
                                <ul className="space-y-2">
                                    <li>
                                        <Link
                                            href="/invisible-characters"
                                            className="text-neutral-600 transition-colors hover:text-neutral-900"
                                        >
                                            Invisible Characters
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/statistical-watermarks"
                                            className="text-neutral-600 transition-colors hover:text-neutral-900"
                                        >
                                            Statistical Watermarks
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="https://promtheon.io/ai-humanizer"
                                            className="text-neutral-600 transition-colors hover:text-neutral-900"
                                        >
                                            AI Humanizer
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Legal */}
                            <div>
                                <h4 className="mb-4 font-semibold text-neutral-900">Legal</h4>
                                <ul className="space-y-2">
                                    <li>
                                        <Link
                                            href="/terms"
                                            className="text-neutral-600 transition-colors hover:text-neutral-900"
                                        >
                                            Terms of Service
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/privacy"
                                            className="text-neutral-600 transition-colors hover:text-neutral-900"
                                        >
                                            Privacy Policy
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-12 border-t border-neutral-200 pt-8">
                            <p className="text-center text-sm text-neutral-500">
                                © 2025 Vertex Media Corporation. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}