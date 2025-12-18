import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { Product, Category, ColumnDefinition } from "./types";
import { slugify } from "./utils";

// Path to the data directory
const DATA_DIR = path.join(process.cwd(), "data");

/**
 * Reads all category folders from the data directory
 * Each folder name becomes a category
 */
export function getCategories(): Category[] {
    const entries = fs.readdirSync(DATA_DIR, { withFileTypes: true });

    const categories = entries
        .filter((entry) => entry.isDirectory())
        .map((entry) => {
            const products = getProductsByCategory(entry.name);
            return {
                name: entry.name.replaceAll("_", " "),
                originalName: entry.name,
                slug: slugify(entry.name),
                productCount: products.length,
            };
        })
        .filter((cat) => cat.productCount > 0);

    return categories;
}

/**
 * Reads and parses the products.csv file for a given category
 */
export function getProductsByCategory(categoryName: string): Product[] {
    const csvPath = path.join(DATA_DIR, categoryName, "products.csv");

    if (!fs.existsSync(csvPath)) {
        console.warn(`No products.csv found for category: ${categoryName}`);
        return [];
    }

    const csvContent = fs.readFileSync(csvPath, "utf-8");

    const result = Papa.parse<Product>(csvContent, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(),
        transform: (value) => value.trim(),
    });

    if (result.errors.length > 0) {
        console.warn(`CSV parsing errors for ${categoryName}:`, result.errors);
    }

    return result.data;
}

/**
 * Extracts column definitions from a product array
 * Automatically detects column types
 */
export function getColumnDefinitions(products: Product[]): ColumnDefinition[] {
    if (products.length === 0) {
        return [];
    }

    const allKeys = new Set<string>();
    products.forEach((product) => {
        Object.keys(product).forEach((key) => allKeys.add(key));
    });

    const priorityOrder = [
        "productName",
        "priceWholesale",
        "priceDrop",
        "description",
        "googleDriveUrl",
    ];

    const sortedKeys = Array.from(allKeys).sort((a, b) => {
        const aIndex = priorityOrder.indexOf(a);
        const bIndex = priorityOrder.indexOf(b);

        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        return a.localeCompare(b);
    });

    return sortedKeys.map((key) => {
        let type: ColumnDefinition["type"] = "text";

        if (key.toLowerCase().includes("price") || key.toLowerCase().includes("cost")) {
            type = "price";
        } else if (key.toLowerCase().includes("url") || key.toLowerCase().includes("link")) {
            type = "url";
        } else {
            const sampleValue = products[0][key];
            if (sampleValue && !isNaN(Number(sampleValue))) {
                type = "number";
            }
        }

        return {
            key,
            label: formatColumnLabel(key),
            type,
        };
    });
}

/**
 * Formats a column key into a human-readable label
 */
function formatColumnLabel(key: string): string {
    return key
        .replace(/([A-Z])/g, " $1")
        .replace(/_/g, " ")
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
}

/**
 * Gets category metadata by slug
 */
export function getCategoryBySlug(slug: string): Category | null {
    const categories = getCategories();
    return categories.find((c) => c.slug === slug) || null;
}