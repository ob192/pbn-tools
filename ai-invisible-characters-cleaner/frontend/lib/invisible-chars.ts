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
    DEPRECATED = 'deprecated',
    CONFUSABLE = 'confusable',
}

export interface InvisibleCharDef {
    codePoint: number;
    name: string;
    category: CharCategory;
    replacement: string | null; // null = remove, string = replace with
    description: string;
    aiWatermarkRisk: 'high' | 'medium' | 'low';
}

export const INVISIBLE_CHAR_DATABASE: InvisibleCharDef[] = [
    // ═══════════════════════════════════════════════════════════════
    // ZERO-WIDTH CHARACTERS (High AI watermark risk)
    // ═══════════════════════════════════════════════════════════════
    {
        codePoint: 0x200B,
        name: 'Zero Width Space',
        category: CharCategory.ZERO_WIDTH,
        replacement: '',
        description: 'Invisible separator, commonly used for AI watermarking',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0x200C,
        name: 'Zero Width Non-Joiner',
        category: CharCategory.ZERO_WIDTH,
        replacement: '',
        description: 'Prevents ligature formation, used in Persian/Arabic',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0x200D,
        name: 'Zero Width Joiner',
        category: CharCategory.ZERO_WIDTH,
        replacement: '',
        description: 'Forces ligature/emoji joining, used in emoji sequences',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0x2060,
        name: 'Word Joiner',
        category: CharCategory.ZERO_WIDTH,
        replacement: '',
        description: 'Prevents line breaks, replacement for deprecated U+FEFF',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0x2061,
        name: 'Function Application',
        category: CharCategory.ZERO_WIDTH,
        replacement: '',
        description: 'Mathematical invisible operator',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0x2062,
        name: 'Invisible Times',
        category: CharCategory.ZERO_WIDTH,
        replacement: '',
        description: 'Mathematical invisible multiplication',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0x2063,
        name: 'Invisible Separator',
        category: CharCategory.ZERO_WIDTH,
        replacement: '',
        description: 'Mathematical invisible separator',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0x2064,
        name: 'Invisible Plus',
        category: CharCategory.ZERO_WIDTH,
        replacement: '',
        description: 'Mathematical invisible addition',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0xFEFF,
        name: 'Byte Order Mark',
        category: CharCategory.ZERO_WIDTH,
        replacement: '',
        description: 'BOM, valid at file start only, watermark when in middle',
        aiWatermarkRisk: 'high',
    },

    // ═══════════════════════════════════════════════════════════════
    // SPACE VARIANTS (Medium AI watermark risk)
    // ═══════════════════════════════════════════════════════════════
    {
        codePoint: 0x00A0,
        name: 'No-Break Space',
        category: CharCategory.SPACE_VARIANT,
        replacement: ' ',
        description: 'Non-breaking space, legitimate use but can be watermark',
        aiWatermarkRisk: 'medium',
    },
    {
        codePoint: 0x2000,
        name: 'En Quad',
        category: CharCategory.SPACE_VARIANT,
        replacement: ' ',
        description: 'Space equal to one en (half an em)',
        aiWatermarkRisk: 'medium',
    },
    {
        codePoint: 0x2001,
        name: 'Em Quad',
        category: CharCategory.SPACE_VARIANT,
        replacement: ' ',
        description: 'Space equal to one em',
        aiWatermarkRisk: 'medium',
    },
    {
        codePoint: 0x2002,
        name: 'En Space',
        category: CharCategory.SPACE_VARIANT,
        replacement: ' ',
        description: 'Half-em width space',
        aiWatermarkRisk: 'medium',
    },
    {
        codePoint: 0x2003,
        name: 'Em Space',
        category: CharCategory.SPACE_VARIANT,
        replacement: ' ',
        description: 'Full-em width space',
        aiWatermarkRisk: 'medium',
    },
    {
        codePoint: 0x2004,
        name: 'Three-Per-Em Space',
        category: CharCategory.SPACE_VARIANT,
        replacement: ' ',
        description: 'One-third em space',
        aiWatermarkRisk: 'medium',
    },
    {
        codePoint: 0x2005,
        name: 'Four-Per-Em Space',
        category: CharCategory.SPACE_VARIANT,
        replacement: ' ',
        description: 'One-fourth em space',
        aiWatermarkRisk: 'medium',
    },
    {
        codePoint: 0x2006,
        name: 'Six-Per-Em Space',
        category: CharCategory.SPACE_VARIANT,
        replacement: ' ',
        description: 'One-sixth em space',
        aiWatermarkRisk: 'medium',
    },
    {
        codePoint: 0x2007,
        name: 'Figure Space',
        category: CharCategory.SPACE_VARIANT,
        replacement: ' ',
        description: 'Width of a digit, for tabular alignment',
        aiWatermarkRisk: 'medium',
    },
    {
        codePoint: 0x2008,
        name: 'Punctuation Space',
        category: CharCategory.SPACE_VARIANT,
        replacement: ' ',
        description: 'Width of a period',
        aiWatermarkRisk: 'medium',
    },
    {
        codePoint: 0x2009,
        name: 'Thin Space',
        category: CharCategory.SPACE_VARIANT,
        replacement: ' ',
        description: 'One-fifth (or one-sixth) em space',
        aiWatermarkRisk: 'medium',
    },
    {
        codePoint: 0x200A,
        name: 'Hair Space',
        category: CharCategory.SPACE_VARIANT,
        replacement: ' ',
        description: 'Thinnest space, narrower than thin space',
        aiWatermarkRisk: 'medium',
    },
    {
        codePoint: 0x202F,
        name: 'Narrow No-Break Space',
        category: CharCategory.SPACE_VARIANT,
        replacement: ' ',
        description: 'Narrow non-breaking space',
        aiWatermarkRisk: 'medium',
    },
    {
        codePoint: 0x205F,
        name: 'Medium Mathematical Space',
        category: CharCategory.SPACE_VARIANT,
        replacement: ' ',
        description: 'Four-eighteenths of an em',
        aiWatermarkRisk: 'medium',
    },
    {
        codePoint: 0x3000,
        name: 'Ideographic Space',
        category: CharCategory.SPACE_VARIANT,
        replacement: ' ',
        description: 'Full-width CJK space',
        aiWatermarkRisk: 'medium',
    },

    // ═══════════════════════════════════════════════════════════════
    // BIDI CONTROL CHARACTERS (High AI watermark risk)
    // ═══════════════════════════════════════════════════════════════
    {
        codePoint: 0x200E,
        name: 'Left-to-Right Mark',
        category: CharCategory.BIDI_CONTROL,
        replacement: '',
        description: 'LRM, forces LTR direction',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0x200F,
        name: 'Right-to-Left Mark',
        category: CharCategory.BIDI_CONTROL,
        replacement: '',
        description: 'RLM, forces RTL direction',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0x202A,
        name: 'Left-to-Right Embedding',
        category: CharCategory.BIDI_CONTROL,
        replacement: '',
        description: 'LRE, starts LTR embedding',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0x202B,
        name: 'Right-to-Left Embedding',
        category: CharCategory.BIDI_CONTROL,
        replacement: '',
        description: 'RLE, starts RTL embedding',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0x202C,
        name: 'Pop Directional Formatting',
        category: CharCategory.BIDI_CONTROL,
        replacement: '',
        description: 'PDF, ends embedding/override',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0x202D,
        name: 'Left-to-Right Override',
        category: CharCategory.BIDI_CONTROL,
        replacement: '',
        description: 'LRO, forces LTR override',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0x202E,
        name: 'Right-to-Left Override',
        category: CharCategory.BIDI_CONTROL,
        replacement: '',
        description: 'RLO, forces RTL override (security risk!)',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0x2066,
        name: 'Left-to-Right Isolate',
        category: CharCategory.BIDI_CONTROL,
        replacement: '',
        description: 'LRI, isolates LTR content',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0x2067,
        name: 'Right-to-Left Isolate',
        category: CharCategory.BIDI_CONTROL,
        replacement: '',
        description: 'RLI, isolates RTL content',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0x2068,
        name: 'First Strong Isolate',
        category: CharCategory.BIDI_CONTROL,
        replacement: '',
        description: 'FSI, auto-detects direction',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0x2069,
        name: 'Pop Directional Isolate',
        category: CharCategory.BIDI_CONTROL,
        replacement: '',
        description: 'PDI, ends isolate',
        aiWatermarkRisk: 'high',
    },

    // ═══════════════════════════════════════════════════════════════
    // FORMAT CONTROL CHARACTERS (Medium-High AI watermark risk)
    // ═══════════════════════════════════════════════════════════════
    {
        codePoint: 0x00AD,
        name: 'Soft Hyphen',
        category: CharCategory.FORMAT_CONTROL,
        replacement: '',
        description: 'Optional hyphenation point, invisible unless line breaks',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0x034F,
        name: 'Combining Grapheme Joiner',
        category: CharCategory.FORMAT_CONTROL,
        replacement: '',
        description: 'CGJ, affects ligature formation',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0x061C,
        name: 'Arabic Letter Mark',
        category: CharCategory.FORMAT_CONTROL,
        replacement: '',
        description: 'ALM, affects Arabic text shaping',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0x180E,
        name: 'Mongolian Vowel Separator',
        category: CharCategory.FORMAT_CONTROL,
        replacement: '',
        description: 'MVS, deprecated as space character',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0x206A,
        name: 'Inhibit Symmetric Swapping',
        category: CharCategory.FORMAT_CONTROL,
        replacement: '',
        description: 'Deprecated Unicode control',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0x206B,
        name: 'Activate Symmetric Swapping',
        category: CharCategory.FORMAT_CONTROL,
        replacement: '',
        description: 'Deprecated Unicode control',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0x206C,
        name: 'Inhibit Arabic Form Shaping',
        category: CharCategory.FORMAT_CONTROL,
        replacement: '',
        description: 'Deprecated Unicode control',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0x206D,
        name: 'Activate Arabic Form Shaping',
        category: CharCategory.FORMAT_CONTROL,
        replacement: '',
        description: 'Deprecated Unicode control',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0x206E,
        name: 'National Digit Shapes',
        category: CharCategory.FORMAT_CONTROL,
        replacement: '',
        description: 'Deprecated Unicode control',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0x206F,
        name: 'Nominal Digit Shapes',
        category: CharCategory.FORMAT_CONTROL,
        replacement: '',
        description: 'Deprecated Unicode control',
        aiWatermarkRisk: 'high',
    },

    // ═══════════════════════════════════════════════════════════════
    // VARIATION SELECTORS (High AI watermark risk)
    // ═══════════════════════════════════════════════════════════════
    {
        codePoint: 0xFE00,
        name: 'Variation Selector-1',
        category: CharCategory.VARIATION_SELECTOR,
        replacement: '',
        description: 'VS1, modifies preceding character appearance',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0xFE01,
        name: 'Variation Selector-2',
        category: CharCategory.VARIATION_SELECTOR,
        replacement: '',
        description: 'VS2',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0xFE02,
        name: 'Variation Selector-3',
        category: CharCategory.VARIATION_SELECTOR,
        replacement: '',
        description: 'VS3',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0xFE03,
        name: 'Variation Selector-4',
        category: CharCategory.VARIATION_SELECTOR,
        replacement: '',
        description: 'VS4',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0xFE04,
        name: 'Variation Selector-5',
        category: CharCategory.VARIATION_SELECTOR,
        replacement: '',
        description: 'VS5',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0xFE05,
        name: 'Variation Selector-6',
        category: CharCategory.VARIATION_SELECTOR,
        replacement: '',
        description: 'VS6',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0xFE06,
        name: 'Variation Selector-7',
        category: CharCategory.VARIATION_SELECTOR,
        replacement: '',
        description: 'VS7',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0xFE07,
        name: 'Variation Selector-8',
        category: CharCategory.VARIATION_SELECTOR,
        replacement: '',
        description: 'VS8',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0xFE08,
        name: 'Variation Selector-9',
        category: CharCategory.VARIATION_SELECTOR,
        replacement: '',
        description: 'VS9',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0xFE09,
        name: 'Variation Selector-10',
        category: CharCategory.VARIATION_SELECTOR,
        replacement: '',
        description: 'VS10',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0xFE0A,
        name: 'Variation Selector-11',
        category: CharCategory.VARIATION_SELECTOR,
        replacement: '',
        description: 'VS11',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0xFE0B,
        name: 'Variation Selector-12',
        category: CharCategory.VARIATION_SELECTOR,
        replacement: '',
        description: 'VS12',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0xFE0C,
        name: 'Variation Selector-13',
        category: CharCategory.VARIATION_SELECTOR,
        replacement: '',
        description: 'VS13',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0xFE0D,
        name: 'Variation Selector-14',
        category: CharCategory.VARIATION_SELECTOR,
        replacement: '',
        description: 'VS14',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0xFE0E,
        name: 'Variation Selector-15',
        category: CharCategory.VARIATION_SELECTOR,
        replacement: '',
        description: 'VS15, text presentation selector',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0xFE0F,
        name: 'Variation Selector-16',
        category: CharCategory.VARIATION_SELECTOR,
        replacement: '',
        description: 'VS16, emoji presentation selector',
        aiWatermarkRisk: 'medium', // Commonly used legitimately for emoji
    },

    // ═══════════════════════════════════════════════════════════════
    // LANGUAGE-SPECIFIC FILLERS (High AI watermark risk)
    // ═══════════════════════════════════════════════════════════════
    {
        codePoint: 0x115F,
        name: 'Hangul Choseong Filler',
        category: CharCategory.LANGUAGE_SPECIFIC,
        replacement: '',
        description: 'Korean initial consonant placeholder',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0x1160,
        name: 'Hangul Jungseong Filler',
        category: CharCategory.LANGUAGE_SPECIFIC,
        replacement: '',
        description: 'Korean medial vowel placeholder',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0x3164,
        name: 'Hangul Filler',
        category: CharCategory.LANGUAGE_SPECIFIC,
        replacement: '',
        description: 'Korean compatibility filler',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0xFFA0,
        name: 'Halfwidth Hangul Filler',
        category: CharCategory.LANGUAGE_SPECIFIC,
        replacement: '',
        description: 'Halfwidth Korean filler',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0x17B4,
        name: 'Khmer Vowel Inherent Aq',
        category: CharCategory.LANGUAGE_SPECIFIC,
        replacement: '',
        description: 'Khmer invisible vowel',
        aiWatermarkRisk: 'high',
    },
    {
        codePoint: 0x17B5,
        name: 'Khmer Vowel Inherent Aa',
        category: CharCategory.LANGUAGE_SPECIFIC,
        replacement: '',
        description: 'Khmer invisible vowel',
        aiWatermarkRisk: 'high',
    },

    // ═══════════════════════════════════════════════════════════════
    // TAG CHARACTERS (Very High AI watermark risk - entire block)
    // ═══════════════════════════════════════════════════════════════
    {
        codePoint: 0xE0001,
        name: 'Language Tag',
        category: CharCategory.TAG_CHARACTER,
        replacement: '',
        description: 'Deprecated language tag introducer',
        aiWatermarkRisk: 'high',
    },
    // E0020-E007F: Tag space through tag delete
    // We'll handle these dynamically as a range

    // ═══════════════════════════════════════════════════════════════
    // CONFUSABLE CHARACTERS (Medium risk - legitimate but swappable)
    // ═══════════════════════════════════════════════════════════════
    {
        codePoint: 0x2018,
        name: 'Left Single Quotation Mark',
        category: CharCategory.CONFUSABLE,
        replacement: "'",
        description: 'Curly quote, often replaced with ASCII',
        aiWatermarkRisk: 'low',
    },
    {
        codePoint: 0x2019,
        name: 'Right Single Quotation Mark',
        category: CharCategory.CONFUSABLE,
        replacement: "'",
        description: 'Curly quote / apostrophe',
        aiWatermarkRisk: 'low',
    },
    {
        codePoint: 0x201B,
        name: 'Single High-Reversed-9 Quotation Mark',
        category: CharCategory.CONFUSABLE,
        replacement: "'",
        description: 'Reversed curly quote',
        aiWatermarkRisk: 'low',
    },
    {
        codePoint: 0x201C,
        name: 'Left Double Quotation Mark',
        category: CharCategory.CONFUSABLE,
        replacement: '"',
        description: 'Opening curly double quote',
        aiWatermarkRisk: 'low',
    },
    {
        codePoint: 0x201D,
        name: 'Right Double Quotation Mark',
        category: CharCategory.CONFUSABLE,
        replacement: '"',
        description: 'Closing curly double quote',
        aiWatermarkRisk: 'low',
    },
    {
        codePoint: 0x201F,
        name: 'Double High-Reversed-9 Quotation Mark',
        category: CharCategory.CONFUSABLE,
        replacement: '"',
        description: 'Reversed curly double quote',
        aiWatermarkRisk: 'low',
    },
    {
        codePoint: 0x2032,
        name: 'Prime',
        category: CharCategory.CONFUSABLE,
        replacement: "'",
        description: 'Prime symbol (feet, minutes)',
        aiWatermarkRisk: 'low',
    },
    {
        codePoint: 0x2033,
        name: 'Double Prime',
        category: CharCategory.CONFUSABLE,
        replacement: '"',
        description: 'Double prime (inches, seconds)',
        aiWatermarkRisk: 'low',
    },
    {
        codePoint: 0x2010,
        name: 'Hyphen',
        category: CharCategory.CONFUSABLE,
        replacement: '-',
        description: 'Unicode hyphen',
        aiWatermarkRisk: 'low',
    },
    {
        codePoint: 0x2011,
        name: 'Non-Breaking Hyphen',
        category: CharCategory.CONFUSABLE,
        replacement: '-',
        description: 'Non-breaking hyphen',
        aiWatermarkRisk: 'low',
    },
    {
        codePoint: 0x2012,
        name: 'Figure Dash',
        category: CharCategory.CONFUSABLE,
        replacement: '-',
        description: 'Dash with digit width',
        aiWatermarkRisk: 'low',
    },
    {
        codePoint: 0x2013,
        name: 'En Dash',
        category: CharCategory.CONFUSABLE,
        replacement: '-',
        description: 'En dash for ranges',
        aiWatermarkRisk: 'low',
    },
    {
        codePoint: 0x2014,
        name: 'Em Dash',
        category: CharCategory.CONFUSABLE,
        replacement: '-',
        description: 'Em dash for breaks',
        aiWatermarkRisk: 'low',
    },
    {
        codePoint: 0x2015,
        name: 'Horizontal Bar',
        category: CharCategory.CONFUSABLE,
        replacement: '-',
        description: 'Quotation dash',
        aiWatermarkRisk: 'low',
    },
    {
        codePoint: 0x2212,
        name: 'Minus Sign',
        category: CharCategory.CONFUSABLE,
        replacement: '-',
        description: 'Mathematical minus',
        aiWatermarkRisk: 'low',
    },
    {
        codePoint: 0x2026,
        name: 'Horizontal Ellipsis',
        category: CharCategory.CONFUSABLE,
        replacement: '...',
        description: 'Single ellipsis character',
        aiWatermarkRisk: 'low',
    },
];

// Generate tag character entries dynamically (U+E0020 to U+E007F)
for (let cp = 0xE0020; cp <= 0xE007F; cp++) {
    INVISIBLE_CHAR_DATABASE.push({
        codePoint: cp,
        name: `Tag ${String.fromCodePoint(cp - 0xE0000)}`,
        category: CharCategory.TAG_CHARACTER,
        replacement: '',
        description: 'Unicode tag character',
        aiWatermarkRisk: 'high',
    });
}

// Build lookup maps for fast access
export const CHAR_BY_CODEPOINT = new Map<number, InvisibleCharDef>(
    INVISIBLE_CHAR_DATABASE.map(def => [def.codePoint, def])
);

export const CHARS_BY_CATEGORY = new Map<CharCategory, InvisibleCharDef[]>();
for (const def of INVISIBLE_CHAR_DATABASE) {
    const arr = CHARS_BY_CATEGORY.get(def.category) || [];
    arr.push(def);
    CHARS_BY_CATEGORY.set(def.category, arr);
}

export const HIGH_RISK_CHARS = INVISIBLE_CHAR_DATABASE.filter(
    def => def.aiWatermarkRisk === 'high'
);