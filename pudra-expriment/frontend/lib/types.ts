/**
 * Represents a single product with dynamic fields
 */
export interface Product {
    // Required core fields
    productName: string;
    priceWholesale: string | number;
    priceDrop: string | number;
    description: string;
    googleDriveUrl: string;

    // Allow any additional dynamic fields
    [key: string]: string | number | undefined;
}

/**
 * Represents a category containing products
 */
export interface Category {
    name: string;
    originalName: string;
    slug: string;
    productCount: number;
}

/**
 * Column definition for dynamic table rendering
 */
export interface ColumnDefinition {
    key: string;
    label: string;
    type: "text" | "price" | "url" | "number";
}