import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { transliterate } from "transliteration";


/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Converts a string to a URL-safe slug
 * Used for generating product URLs from product names
 */
export function slugify(text: string): string {
    return transliterate(text)
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}


/**
 * Converts a slug back to a readable format
 * Used for display purposes
 */
export function deslugify(slug: string): string {
    return slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

/**
 * Formats a number as currency
 */
export function formatCurrency(value: number | string): string {
    const num = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(num);
}

/**
 * Calculates discount percentage between wholesale and drop price
 */
export function calculateDiscount(wholesale: number, drop: number): number {
    if (drop === 0) return 0;
    return Math.round(((drop - wholesale) / drop) * 100);
}

/**
 * Checks if a value looks like a price field
 */
export function isPriceField(fieldName: string): boolean {
    const priceKeywords = ["price", "cost", "amount", "fee", "rate"];
    return priceKeywords.some((keyword) =>
        fieldName.toLowerCase().includes(keyword)
    );
}

/**
 * Checks if a value looks like a URL
 */
export function isUrlField(value: string): boolean {
    try {
        new URL(value);
        return true;
    } catch {
        return false;
    }
}

/**
 * Formats a field name for display
 * Converts camelCase or snake_case to Title Case
 */
export function formatFieldName(fieldName: string): string {
    return fieldName
        .replace(/([A-Z])/g, " $1") // Add space before capital letters
        .replace(/_/g, " ") // Replace underscores with spaces
        .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
        .trim();
}