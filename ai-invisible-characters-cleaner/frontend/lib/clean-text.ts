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

export interface CleanResult {
    cleanedText: string;
    originalLength: number;
    cleanedLength: number;
    removedCount: number;
    normalizedCount: number;
    detectedChars: DetectedChar[];
    statistics: CleanStatistics;
}

export interface CleanStatistics {
    byCategory: Record<string, number>;
    byRisk: { high: number; medium: number; low: number };
    byCodePoint: Record<string, number>;
    totalInvisible: number;
    suspicionScore: number;
    verdict: 'clean' | 'suspicious' | 'likely-watermarked';
}

// ═══════════════════════════════════════════════════════════════════════════════
// CORE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

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
 * Check if a code point should be processed
 */
function shouldProcess(cp: number): boolean {
    // Skip regular ASCII (except control chars we want to catch)
    if (cp === 0x20 || cp === 0x09 || cp === 0x0A || cp === 0x0D) return false;

    // Check our database first
    if (CHAR_BY_CODEPOINT.has(cp)) return true;

    // Check Cf category
    if (isFormatCategory(cp)) return true;

    // Check variation selectors
    if (cp >= 0xFE00 && cp <= 0xFE0F) return true;
    if (cp >= 0xE0100 && cp <= 0xE01EF) return true;

    return false;
}

/**
 * Get the replacement for a code point
 */
function getReplacement(cp: number): string {
    const def = CHAR_BY_CODEPOINT.get(cp);
    if (def) {
        return def.replacement ?? '';
    }
    // Default: remove unknown invisible chars
    return '';
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

/**
 * Clean text by removing/normalizing invisible characters
 */
export function cleanText(text: string): CleanResult {
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

    for (let i = 0; i < text.length; ) {
        const cp = text.codePointAt(i)!;
        const charLen = cp > 0xFFFF ? 2 : 1;
        const char = charLen === 1 ? text[i] : text.slice(i, i + charLen);

        if (shouldProcess(cp)) {
            const info = getCharInfo(cp);
            const codePointHex = formatCodePoint(cp);

            // Track detected character
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

            // Update statistics
            byCategory[info.category] = (byCategory[info.category] || 0) + 1;
            byRisk[info.risk]++;
            byCodePoint[codePointHex] = (byCodePoint[codePointHex] || 0) + 1;

            // Get replacement
            const replacement = getReplacement(cp);

            if (replacement === '') {
                removedCount++;
            } else {
                cleanedText += replacement;
                normalizedCount++;
            }
        } else {
            cleanedText += char;

            // Track newlines for line/column
            if (cp === 0x0A) {
                line++;
                column = 0;
            }
        }

        column++;
        i += charLen;
    }

    // Calculate suspicion score
    const totalInvisible = detectedChars.length;
    let suspicionScore = 0;

    suspicionScore += byRisk.high * 15;
    suspicionScore += byRisk.medium * 5;
    suspicionScore += byRisk.low * 1;

    // Diversity penalty
    const uniqueChars = Object.keys(byCodePoint).length;
    if (uniqueChars > 3) {
        suspicionScore += (uniqueChars - 3) * 10;
    }

    // Volume penalty
    if (totalInvisible > 10) {
        suspicionScore += Math.min((totalInvisible - 10) * 2, 30);
    }

    suspicionScore = Math.min(100, suspicionScore);

    const verdict: 'clean' | 'suspicious' | 'likely-watermarked' =
        suspicionScore === 0 ? 'clean' :
            suspicionScore < 30 ? 'suspicious' : 'likely-watermarked';

    return {
        cleanedText,
        originalLength: text.length,
        cleanedLength: cleanedText.length,
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

/**
 * Quick check if text contains invisible characters
 */
export function hasInvisibleChars(text: string): boolean {
    for (let i = 0; i < text.length; ) {
        const cp = text.codePointAt(i)!;
        if (shouldProcess(cp)) return true;
        i += cp > 0xFFFF ? 2 : 1;
    }
    return false;
}

/**
 * Detect invisible characters without removing them
 */
export function detectInvisibleChars(text: string): DetectedChar[] {
    const result = cleanText(text);
    return result.detectedChars;
}

/**
 * Visualize invisible characters with markers
 */
export function visualize(text: string): string {
    let result = '';

    for (let i = 0; i < text.length; ) {
        const cp = text.codePointAt(i)!;
        const charLen = cp > 0xFFFF ? 2 : 1;
        const char = charLen === 1 ? text[i] : text.slice(i, i + charLen);

        if (shouldProcess(cp)) {
            result += `⟦${formatCodePoint(cp)}⟧`;
        } else {
            result += char;
        }

        i += charLen;
    }

    return result;
}