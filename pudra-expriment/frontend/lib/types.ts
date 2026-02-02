// lib/types.ts
import {
    Product as PrismaProduct,
    Category as PrismaCategory,
    FieldType,
    Prisma
} from '@prisma/client';

/**
 * Extended Product type with category relation
 */
export interface Product extends Omit<PrismaProduct, 'extraFields'> {
    category?: Category;
    extraFields?: Prisma.JsonValue | null;
}

/**
 * Extended Category type with product count
 */
export interface Category extends PrismaCategory {
    productCount?: number;
    _count?: {
        products: number;
    };
}

/**
 * Column definition for dynamic table rendering
 */
export interface ColumnDefinition {
    key: string;
    label: string;
    type: 'text' | 'price' | 'url' | 'number' | 'date';
    order?: number;
}

/**
 * Product with dynamic fields flattened
 */
export interface ProductWithFields extends Omit<PrismaProduct, 'extraFields' | 'priceWholesale' | 'priceDrop'> {
    priceWholesale: number | Prisma.Decimal;
    priceDrop: number | Prisma.Decimal;
    [key: string]: any; // Allow dynamic fields
}

/**
 * Filter options for products
 */
export interface ProductFilters {
    categoryId?: string;
    search?: string;
    isActive?: boolean;
    minPrice?: number;
    maxPrice?: number;
}

/**
 * Pagination options
 */
export interface PaginationOptions {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

/**
 * Type guard for checking if value is a Record
 */
export function isRecord(value: unknown): value is Record<string, any> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}