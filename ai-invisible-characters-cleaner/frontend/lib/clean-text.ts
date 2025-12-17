// lib/clean-text.ts

/**
 * Comprehensive invisible Unicode character definitions
 * Organized by category for better maintainability
 */

export enum CharCategory {
    ZERO_WIDTH = 'zero-width',
    SPACE_VARIANT = 'space-variant',
    FORMAT_CONTROL = 'format-control',
    BIDI_CONTROL = 'bidi-control',
    VARIATION_SELECTOR = 'variation-selector',
    TAG_CHARACTER = 'tag-character',
    LANGUAGE_SPECIFIC = 'language-specific',
}

export interface InvisibleCharDef {
    codePoint: number;
    name: string;
    category: CharCategory;
    replacement: string | null; // null = remove, string = replace with
    aiWatermarkRisk: 'high' | 'medium' | 'low';
}

/**
 * Database of invisible characters with their properties
 */
const INVISIBLE_CHAR_DATABASE: InvisibleCharDef[] = [
    // Zero-Width Characters (High AI watermark risk)
    { codePoint: 0x200B, name: 'Zero Width Space', category: CharCategory.ZERO_WIDTH, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0x200C, name: 'Zero Width Non-Joiner', category: CharCategory.ZERO_WIDTH, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0x200D, name: 'Zero Width Joiner', category: CharCategory.ZERO_WIDTH, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0x2060, name: 'Word Joiner', category: CharCategory.ZERO_WIDTH, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0x2061, name: 'Function Application', category: CharCategory.ZERO_WIDTH, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0x2062, name: 'Invisible Times', category: CharCategory.ZERO_WIDTH, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0x2063, name: 'Invisible Separator', category: CharCategory.ZERO_WIDTH, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0x2064, name: 'Invisible Plus', category: CharCategory.ZERO_WIDTH, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0xFEFF, name: 'Byte Order Mark', category: CharCategory.ZERO_WIDTH, replacement: '', aiWatermarkRisk: 'high' },

    // Space Variants (Medium AI watermark risk)
    { codePoint: 0x00A0, name: 'No-Break Space', category: CharCategory.SPACE_VARIANT, replacement: ' ', aiWatermarkRisk: 'medium' },
    { codePoint: 0x2000, name: 'En Quad', category: CharCategory.SPACE_VARIANT, replacement: ' ', aiWatermarkRisk: 'medium' },
    { codePoint: 0x2001, name: 'Em Quad', category: CharCategory.SPACE_VARIANT, replacement: ' ', aiWatermarkRisk: 'medium' },
    { codePoint: 0x2002, name: 'En Space', category: CharCategory.SPACE_VARIANT, replacement: ' ', aiWatermarkRisk: 'medium' },
    { codePoint: 0x2003, name: 'Em Space', category: CharCategory.SPACE_VARIANT, replacement: ' ', aiWatermarkRisk: 'medium' },
    { codePoint: 0x2004, name: 'Three-Per-Em Space', category: CharCategory.SPACE_VARIANT, replacement: ' ', aiWatermarkRisk: 'medium' },
    { codePoint: 0x2005, name: 'Four-Per-Em Space', category: CharCategory.SPACE_VARIANT, replacement: ' ', aiWatermarkRisk: 'medium' },
    { codePoint: 0x2006, name: 'Six-Per-Em Space', category: CharCategory.SPACE_VARIANT, replacement: ' ', aiWatermarkRisk: 'medium' },
    { codePoint: 0x2007, name: 'Figure Space', category: CharCategory.SPACE_VARIANT, replacement: ' ', aiWatermarkRisk: 'medium' },
    { codePoint: 0x2008, name: 'Punctuation Space', category: CharCategory.SPACE_VARIANT, replacement: ' ', aiWatermarkRisk: 'medium' },
    { codePoint: 0x2009, name: 'Thin Space', category: CharCategory.SPACE_VARIANT, replacement: ' ', aiWatermarkRisk: 'medium' },
    { codePoint: 0x200A, name: 'Hair Space', category: CharCategory.SPACE_VARIANT, replacement: ' ', aiWatermarkRisk: 'medium' },
    { codePoint: 0x202F, name: 'Narrow No-Break Space', category: CharCategory.SPACE_VARIANT, replacement: ' ', aiWatermarkRisk: 'medium' },
    { codePoint: 0x205F, name: 'Medium Mathematical Space', category: CharCategory.SPACE_VARIANT, replacement: ' ', aiWatermarkRisk: 'medium' },
    { codePoint: 0x3000, name: 'Ideographic Space', category: CharCategory.SPACE_VARIANT, replacement: ' ', aiWatermarkRisk: 'medium' },

    // Bidi Control Characters (High AI watermark risk)
    { codePoint: 0x200E, name: 'Left-to-Right Mark', category: CharCategory.BIDI_CONTROL, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0x200F, name: 'Right-to-Left Mark', category: CharCategory.BIDI_CONTROL, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0x202A, name: 'Left-to-Right Embedding', category: CharCategory.BIDI_CONTROL, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0x202B, name: 'Right-to-Left Embedding', category: CharCategory.BIDI_CONTROL, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0x202C, name: 'Pop Directional Formatting', category: CharCategory.BIDI_CONTROL, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0x202D, name: 'Left-to-Right Override', category: CharCategory.BIDI_CONTROL, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0x202E, name: 'Right-to-Left Override', category: CharCategory.BIDI_CONTROL, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0x2066, name: 'Left-to-Right Isolate', category: CharCategory.BIDI_CONTROL, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0x2067, name: 'Right-to-Left Isolate', category: CharCategory.BIDI_CONTROL, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0x2068, name: 'First Strong Isolate', category: CharCategory.BIDI_CONTROL, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0x2069, name: 'Pop Directional Isolate', category: CharCategory.BIDI_CONTROL, replacement: '', aiWatermarkRisk: 'high' },

    // Format Control Characters (High AI watermark risk)
    { codePoint: 0x00AD, name: 'Soft Hyphen', category: CharCategory.FORMAT_CONTROL, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0x034F, name: 'Combining Grapheme Joiner', category: CharCategory.FORMAT_CONTROL, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0x061C, name: 'Arabic Letter Mark', category: CharCategory.FORMAT_CONTROL, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0x180E, name: 'Mongolian Vowel Separator', category: CharCategory.FORMAT_CONTROL, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0x206A, name: 'Inhibit Symmetric Swapping', category: CharCategory.FORMAT_CONTROL, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0x206B, name: 'Activate Symmetric Swapping', category: CharCategory.FORMAT_CONTROL, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0x206C, name: 'Inhibit Arabic Form Shaping', category: CharCategory.FORMAT_CONTROL, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0x206D, name: 'Activate Arabic Form Shaping', category: CharCategory.FORMAT_CONTROL, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0x206E, name: 'National Digit Shapes', category: CharCategory.FORMAT_CONTROL, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0x206F, name: 'Nominal Digit Shapes', category: CharCategory.FORMAT_CONTROL, replacement: '', aiWatermarkRisk: 'high' },

    // Variation Selectors (High AI watermark risk)
    { codePoint: 0xFE00, name: 'Variation Selector-1', category: CharCategory.VARIATION_SELECTOR, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0xFE01, name: 'Variation Selector-2', category: CharCategory.VARIATION_SELECTOR, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0xFE02, name: 'Variation Selector-3', category: CharCategory.VARIATION_SELECTOR, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0xFE03, name: 'Variation Selector-4', category: CharCategory.VARIATION_SELECTOR, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0xFE04, name: 'Variation Selector-5', category: CharCategory.VARIATION_SELECTOR, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0xFE05, name: 'Variation Selector-6', category: CharCategory.VARIATION_SELECTOR, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0xFE06, name: 'Variation Selector-7', category: CharCategory.VARIATION_SELECTOR, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0xFE07, name: 'Variation Selector-8', category: CharCategory.VARIATION_SELECTOR, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0xFE08, name: 'Variation Selector-9', category: CharCategory.VARIATION_SELECTOR, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0xFE09, name: 'Variation Selector-10', category: CharCategory.VARIATION_SELECTOR, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0xFE0A, name: 'Variation Selector-11', category: CharCategory.VARIATION_SELECTOR, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0xFE0B, name: 'Variation Selector-12', category: CharCategory.VARIATION_SELECTOR, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0xFE0C, name: 'Variation Selector-13', category: CharCategory.VARIATION_SELECTOR, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0xFE0D, name: 'Variation Selector-14', category: CharCategory.VARIATION_SELECTOR, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0xFE0E, name: 'Variation Selector-15 (Text)', category: CharCategory.VARIATION_SELECTOR, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0xFE0F, name: 'Variation Selector-16 (Emoji)', category: CharCategory.VARIATION_SELECTOR, replacement: '', aiWatermarkRisk: 'medium' },

    // Language-Specific Fillers (High AI watermark risk)
    { codePoint: 0x115F, name: 'Hangul Choseong Filler', category: CharCategory.LANGUAGE_SPECIFIC, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0x1160, name: 'Hangul Jungseong Filler', category: CharCategory.LANGUAGE_SPECIFIC, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0x3164, name: 'Hangul Filler', category: CharCategory.LANGUAGE_SPECIFIC, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0xFFA0, name: 'Halfwidth Hangul Filler', category: CharCategory.LANGUAGE_SPECIFIC, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0x17B4, name: 'Khmer Vowel Inherent Aq', category: CharCategory.LANGUAGE_SPECIFIC, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0x17B5, name: 'Khmer Vowel Inherent Aa', category: CharCategory.LANGUAGE_SPECIFIC, replacement: '', aiWatermarkRisk: 'high' },

    // Annotation Characters
    { codePoint: 0xFFF9, name: 'Interlinear Annotation Anchor', category: CharCategory.FORMAT_CONTROL, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0xFFFA, name: 'Interlinear Annotation Separator', category: CharCategory.FORMAT_CONTROL, replacement: '', aiWatermarkRisk: 'high' },
    { codePoint: 0xFFFB, name: 'Interlinear Annotation Terminator', category: CharCategory.FORMAT_CONTROL, replacement: '', aiWatermarkRisk: 'high' },
];

// Add Tag Characters (U+E0020 to U+E007F)
for (let cp = 0xE0001; cp <= 0xE007F; cp++) {
    INVISIBLE_CHAR_DATABASE.push({
        codePoint: cp,
        name: cp === 0xE0001 ? 'Language Tag' : `Tag ${String.fromCodePoint(cp - 0xE0000)}`,
        category: CharCategory.TAG_CHARACTER,
        replacement: '',
        aiWatermarkRisk: 'high',
    });
}

// Build lookup map for fast access
const CHAR_BY_CODEPOINT = new Map<number, InvisibleCharDef>(
    INVISIBLE_CHAR_DATABASE.map(def => [def.codePoint, def])
);

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface DetectedChar {
    codePoint: number;
    codePointHex: string;
    position: number;
    line: number;
    column: number;
    name: string;
    category: CharCategory;
    aiWatermarkRisk: 'high' | 'medium' | 'low';
}

export interface CleanStatistics {
    byCategory: Record<string, number>;
    byRisk: { high: number; medium: number; low: number };
    byCodePoint: Record<string, number>;
    totalInvisible: number;
    suspicionScore: number;
    verdict: 'clean' | 'suspicious' | 'likely-watermarked';
}

export interface CleanOptions {
    /** Removes invisible chars like zero-width, bidi controls, format controls, variation selectors, tags, etc. */
    removeHiddenCharacters?: boolean;
    /** Replaces NBSP and other Unicode space variants with regular spaces. */
    convertNonBreakingSpaces?: boolean;

    /** Converts em/en dashes and similar to plain "-" */
    normalizeDashes?: boolean;
    /** Converts smart/curly quotes to straight quotes */
    normalizeQuotes?: boolean;
    /** Converts the ellipsis character (…) to "..." */
    convertEllipsis?: boolean;

    /** Removes spaces/tabs at end of each line */
    removeTrailingWhitespace?: boolean;
    /** Removes all "*" characters */
    removeAsterisks?: boolean;
    /** Removes markdown heading prefixes (#..###### + space) from line starts */
    removeMarkdownHeadings?: boolean;
}

export type ResolvedCleanOptions = Required<CleanOptions>;

export const DEFAULT_CLEAN_OPTIONS: ResolvedCleanOptions = {
    removeHiddenCharacters: true,
    convertNonBreakingSpaces: true,
    normalizeDashes: true,
    normalizeQuotes: true,
    convertEllipsis: true,
    removeTrailingWhitespace: true,
    removeAsterisks: true,
    removeMarkdownHeadings: true,
};

export function resetCleanOptions(): ResolvedCleanOptions {
    return { ...DEFAULT_CLEAN_OPTIONS };
}

export interface TextTransformCounts {
    normalizedDashes: number;
    normalizedQuotes: number;
    convertedEllipsis: number;
    removedTrailingWhitespace: number; // characters removed
    removedAsterisks: number;
    removedMarkdownHeadings: number;  // lines affected
}

export interface CleanResult {
    cleanedText: string;
    originalLength: number;
    cleanedLength: number;

    /** Counts from the invisible-character pass only (kept for backwards-compatibility). */
    removedCount: number;
    /** Counts from the invisible-character pass only (kept for backwards-compatibility). */
    normalizedCount: number;

    detectedChars: DetectedChar[];
    statistics: CleanStatistics;

    /** The effective options used for this run. */
    options?: ResolvedCleanOptions;

    /** Counts from the post-processing transforms (dashes/quotes/ellipsis/etc). */
    transforms?: TextTransformCounts;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CORE FUNCTIONS (INVISIBLE CHAR DETECTION + REPLACEMENT)
// ═══════════════════════════════════════════════════════════════════════════════

function resolveOptions(options?: CleanOptions): ResolvedCleanOptions {
    return { ...DEFAULT_CLEAN_OPTIONS, ...(options ?? {}) };
}

/**
 * Check if a code point is in the Unicode Cf (Format) category
 * This catches characters we might have missed in our database
 */
function isFormatCategory(cp: number): boolean {
    // Known Cf ranges
    if (cp === 0x00AD) return true; // Soft Hyphen
    if (cp >= 0x0600 && cp <= 0x0605) return true; // Arabic format chars
    if (cp === 0x061C) return true; // Arabic Letter Mark
    if (cp === 0x06DD) return true; // Arabic End of Ayah
    if (cp === 0x070F) return true; // Syriac Abbreviation Mark
    if (cp === 0x08E2) return true; // Arabic Disputed End of Ayah
    if (cp === 0x180E) return true; // Mongolian Vowel Separator
    if (cp >= 0x200B && cp <= 0x200F) return true; // Zero-width and direction
    if (cp >= 0x202A && cp <= 0x202E) return true; // Bidi controls
    if (cp >= 0x2060 && cp <= 0x2064) return true; // Word joiner, invisible operators
    if (cp >= 0x2066 && cp <= 0x206F) return true; // Bidi isolates and deprecated
    if (cp === 0xFEFF) return true; // BOM
    if (cp >= 0xFFF9 && cp <= 0xFFFB) return true; // Annotation chars
    if (cp >= 0x1BCA0 && cp <= 0x1BCA3) return true; // Shorthand format controls
    if (cp >= 0x1D173 && cp <= 0x1D17A) return true; // Musical symbols
    if (cp >= 0xE0001 && cp <= 0xE007F) return true; // Tags
    if (cp >= 0xE0100 && cp <= 0xE01EF) return true; // Variation selectors supplement
    return false;
}

/**
 * Check if a code point should be processed (based on the enabled options)
 */
function shouldProcess(cp: number, options: ResolvedCleanOptions): boolean {
    // Skip regular ASCII (except control chars we want to catch)
    if (cp === 0x20 || cp === 0x09 || cp === 0x0A || cp === 0x0D) return false;

    const def = CHAR_BY_CODEPOINT.get(cp);
    if (def) {
        if (def.category === CharCategory.SPACE_VARIANT) return options.convertNonBreakingSpaces;
        return options.removeHiddenCharacters;
    }

    if (!options.removeHiddenCharacters) return false;

    // Check Cf category
    if (isFormatCategory(cp)) return true;

    // Check variation selectors
    if (cp >= 0xFE00 && cp <= 0xFE0F) return true;
    if (cp >= 0xE0100 && cp <= 0xE01EF) return true;

    return false;
}

/**
 * Get the replacement for a code point (based on the enabled options)
 */
function getReplacement(cp: number, originalChar: string, options: ResolvedCleanOptions): string {
    const def = CHAR_BY_CODEPOINT.get(cp);
    if (def) {
        if (def.category === CharCategory.SPACE_VARIANT && !options.convertNonBreakingSpaces) return originalChar;
        if (def.category !== CharCategory.SPACE_VARIANT && !options.removeHiddenCharacters) return originalChar;
        return def.replacement ?? '';
    }

    // Unknown invisible chars:
    // - If hidden-char removal is on: remove them
    // - Otherwise: keep them (though we generally won't reach here if shouldProcess is correct)
    return options.removeHiddenCharacters ? '' : originalChar;
}

/**
 * Get character info for a code point
 */
function getCharInfo(cp: number): { name: string; category: CharCategory; risk: 'high' | 'medium' | 'low' } {
    const def = CHAR_BY_CODEPOINT.get(cp);
    if (def) {
        return {
            name: def.name,
            category: def.category,
            risk: def.aiWatermarkRisk,
        };
    }

    // Fallback for unknown Cf characters
    return {
        name: `Unknown Format Character (U+${cp.toString(16).toUpperCase().padStart(4, '0')})`,
        category: CharCategory.FORMAT_CONTROL,
        risk: 'high',
    };
}

/**
 * Format a code point as a hex string
 */
function formatCodePoint(cp: number): string {
    return `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`;
}

function cleanInvisiblePass(text: string, options: ResolvedCleanOptions): {
    cleanedText: string;
    removedCount: number;
    normalizedCount: number;
    detectedChars: DetectedChar[];
    statistics: CleanStatistics;
} {
    const detectedChars: DetectedChar[] = [];
    const byCategory: Record<string, number> = {};
    const byRisk = { high: 0, medium: 0, low: 0 };
    const byCodePoint: Record<string, number> = {};

    let cleanedText = '';
    let removedCount = 0;
    let normalizedCount = 0;

    // Track line/column
    let line = 1;
    let column = 1;

    for (let i = 0; i < text.length;) {
        const cp = text.codePointAt(i)!;
        const charLen = cp > 0xFFFF ? 2 : 1;
        const char = charLen === 1 ? text[i] : text.slice(i, i + charLen);

        if (shouldProcess(cp, options)) {
            const info = getCharInfo(cp);
            const codePointHex = formatCodePoint(cp);

            detectedChars.push({
                codePoint: cp,
                codePointHex,
                position: i,
                line,
                column,
                name: info.name,
                category: info.category,
                aiWatermarkRisk: info.risk,
            });

            byCategory[info.category] = (byCategory[info.category] || 0) + 1;
            byRisk[info.risk]++;
            byCodePoint[codePointHex] = (byCodePoint[codePointHex] || 0) + 1;

            const replacement = getReplacement(cp, char, options);

            if (replacement === '') {
                removedCount++;
            } else {
                cleanedText += replacement;
                normalizedCount++;
            }
        } else {
            cleanedText += char;

            if (cp === 0x0A) {
                line++;
                column = 0;
            }
        }

        column++;
        i += charLen;
    }

    // Calculate suspicion score (same logic as before)
    const totalInvisible = detectedChars.length;
    let suspicionScore = 0;

    suspicionScore += byRisk.high * 15;
    suspicionScore += byRisk.medium * 5;
    suspicionScore += byRisk.low * 1;

    const uniqueChars = Object.keys(byCodePoint).length;
    if (uniqueChars > 3) {
        suspicionScore += (uniqueChars - 3) * 10;
    }

    if (totalInvisible > 10) {
        suspicionScore += Math.min((totalInvisible - 10) * 2, 30);
    }

    suspicionScore = Math.min(100, suspicionScore);

    const verdict: 'clean' | 'suspicious' | 'likely-watermarked' =
        suspicionScore === 0 ? 'clean' :
            suspicionScore < 30 ? 'suspicious' : 'likely-watermarked';

    return {
        cleanedText,
        removedCount,
        normalizedCount,
        detectedChars,
        statistics: {
            byCategory,
            byRisk,
            byCodePoint,
            totalInvisible,
            suspicionScore,
            verdict,
        },
    };
}

// ═══════════════════════════════════════════════════════════════════════════════
// POST-TRANSFORMS (DASHES / QUOTES / ELLIPSIS / MARKDOWN / WHITESPACE)
// ═══════════════════════════════════════════════════════════════════════════════

function replaceWithCount(text: string, re: RegExp, replacement: string): { text: string; count: number } {
    let count = 0;
    const out = text.replace(re, () => {
        count++;
        return replacement;
    });
    return { text: out, count };
}

function removeWithCount(text: string, re: RegExp): { text: string; count: number } {
    let count = 0;
    const out = text.replace(re, () => {
        count++;
        return '';
    });
    return { text: out, count };
}

function removeTrailingWhitespaceWithCount(text: string): { text: string; removedChars: number } {
    let removedChars = 0;
    const out = text.replace(/[ \t]+(?=\r?\n|$)/g, (m) => {
        removedChars += m.length;
        return '';
    });
    return { text: out, removedChars };
}

function applyTextTransforms(input: string, options: ResolvedCleanOptions): { text: string; counts: TextTransformCounts } {
    let text = input;

    const counts: TextTransformCounts = {
        normalizedDashes: 0,
        normalizedQuotes: 0,
        convertedEllipsis: 0,
        removedTrailingWhitespace: 0,
        removedAsterisks: 0,
        removedMarkdownHeadings: 0,
    };

    if (options.convertEllipsis) {
        const r = replaceWithCount(text, /\u2026/g, '...');
        text = r.text;
        counts.convertedEllipsis += r.count;
    }

    if (options.normalizeQuotes) {
        // Single quotes / apostrophes
        const single = replaceWithCount(text, /[\u2018\u2019\u201A\u201B\u02BC\u2032]/g, `'`);
        text = single.text;
        let quoteCount = single.count;

        // Double quotes
        const dbl = replaceWithCount(text, /[\u201C\u201D\u201E\u201F\u00AB\u00BB\u2033]/g, `"`);
        text = dbl.text;
        quoteCount += dbl.count;

        counts.normalizedQuotes += quoteCount;
    }

    if (options.normalizeDashes) {
        // Hyphen / dash variants + minus sign to "-"
        const r = replaceWithCount(text, /[\u2010\u2011\u2012\u2013\u2014\u2212]/g, '-');
        text = r.text;
        counts.normalizedDashes += r.count;
    }

    if (options.removeMarkdownHeadings) {
        // Only treat as a markdown heading if there is whitespace after the hashes,
        // so things like "#include" won't be stripped.
        const headingRe = /^[ \t]{0,3}#{1,6}[ \t]+/gm;
        const matches = text.match(headingRe);
        counts.removedMarkdownHeadings = matches ? matches.length : 0;
        text = text.replace(headingRe, '');
    }

    if (options.removeAsterisks) {
        const r = removeWithCount(text, /\*/g);
        text = r.text;
        counts.removedAsterisks += r.count;
    }

    if (options.removeTrailingWhitespace) {
        const r = removeTrailingWhitespaceWithCount(text);
        text = r.text;
        counts.removedTrailingWhitespace += r.removedChars;
    }

    return { text, counts };
}

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Clean text by removing/normalizing invisible characters + optional text transforms.
 * Backwards-compatible: calling cleanText(text) behaves like "Reset All" (everything on).
 */
export function cleanText(text: string, options?: CleanOptions): CleanResult {
    const resolved = resolveOptions(options);

    const invisible = cleanInvisiblePass(text, resolved);
    const transformed = applyTextTransforms(invisible.cleanedText, resolved);

    return {
        cleanedText: transformed.text,
        originalLength: text.length,
        cleanedLength: transformed.text.length,

        removedCount: invisible.removedCount,
        normalizedCount: invisible.normalizedCount,

        detectedChars: invisible.detectedChars,
        statistics: invisible.statistics,

        options: resolved,
        transforms: transformed.counts,
    };
}

/**
 * Quick check if text contains invisible characters (using hidden-char + NBSP detection).
 */
export function hasInvisibleChars(text: string): boolean {
    const opts: ResolvedCleanOptions = {
        removeHiddenCharacters: true,
        convertNonBreakingSpaces: true,
        normalizeDashes: false,
        normalizeQuotes: false,
        convertEllipsis: false,
        removeTrailingWhitespace: false,
        removeAsterisks: false,
        removeMarkdownHeadings: false,
    };

    for (let i = 0; i < text.length;) {
        const cp = text.codePointAt(i)!;
        if (shouldProcess(cp, opts)) return true;
        i += cp > 0xFFFF ? 2 : 1;
    }
    return false;
}

/**
 * Detect invisible characters without applying other transforms.
 */
export function detectInvisibleChars(text: string): DetectedChar[] {
    const opts: ResolvedCleanOptions = {
        removeHiddenCharacters: true,
        convertNonBreakingSpaces: true,
        normalizeDashes: false,
        normalizeQuotes: false,
        convertEllipsis: false,
        removeTrailingWhitespace: false,
        removeAsterisks: false,
        removeMarkdownHeadings: false,
    };

    return cleanInvisiblePass(text, opts).detectedChars;
}

/**
 * Visualize invisible characters with markers (uses hidden-char + NBSP detection).
 */
export function visualize(text: string): string {
    const opts: ResolvedCleanOptions = {
        removeHiddenCharacters: true,
        convertNonBreakingSpaces: true,
        normalizeDashes: false,
        normalizeQuotes: false,
        convertEllipsis: false,
        removeTrailingWhitespace: false,
        removeAsterisks: false,
        removeMarkdownHeadings: false,
    };

    let result = '';

    for (let i = 0; i < text.length;) {
        const cp = text.codePointAt(i)!;
        const charLen = cp > 0xFFFF ? 2 : 1;
        const char = charLen === 1 ? text[i] : text.slice(i, i + charLen);

        if (shouldProcess(cp, opts)) {
            result += `⟦${formatCodePoint(cp)}⟧`;
        } else {
            result += char;
        }

        i += charLen;
    }

    return result;
}
