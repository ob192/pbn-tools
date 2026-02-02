// lib/data-service.ts
import { prisma } from './prisma';
import { Category, Product, ProductWithFields, ColumnDefinition, ProductFilters, PaginationOptions, isRecord } from './types';
import { slugify } from './utils';
import {FieldType, Prisma} from '@prisma/client';

/**
 * Get all categories with product counts
 */
export async function getCategories(): Promise<Category[]> {
    const categories = await prisma.category.findMany({
        include: {
            _count: {
                select: { products: true },
            },
        },
        orderBy: { name: 'asc' },
    });

    return categories.map(cat => ({
        ...cat,
        productCount: cat._count.products,
    }));
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
    const category = await prisma.category.findUnique({
        where: { slug },
        include: {
            _count: {
                select: { products: true },
            },
        },
    });

    if (!category) return null;

    return {
        ...category,
        productCount: category._count.products,
    };
}

/**
 * Get products by category with filtering and pagination
 */
export async function getProductsByCategory(
    categorySlug: string,
    filters?: ProductFilters,
    pagination?: PaginationOptions
): Promise<{ products: ProductWithFields[]; total: number }> {
    const category = await getCategoryBySlug(categorySlug);

    if (!category) {
        return { products: [], total: 0 };
    }

    const where: Prisma.ProductWhereInput = {
        categoryId: category.id,
        isActive: filters?.isActive ?? true,
        ...(filters?.search && {
            OR: [
                { productName: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
            ],
        }),
        ...(filters?.minPrice && {
            priceWholesale: { gte: filters.minPrice },
        }),
        ...(filters?.maxPrice && {
            priceWholesale: { lte: filters.maxPrice },
        }),
    };

    const page = pagination?.page ?? 1;
    const pageSize = pagination?.pageSize ?? 50;
    const skip = (page - 1) * pageSize;

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            skip,
            take: pageSize,
            orderBy: pagination?.sortBy
                ? { [pagination.sortBy]: pagination.sortOrder ?? 'asc' }
                : { createdAt: 'desc' },
        }),
        prisma.product.count({ where }),
    ]);

    // Flatten extraFields into main object
    const productsWithFields: ProductWithFields[] = products.map(product => {
        const { extraFields, ...rest } = product;

        // Convert Prisma.JsonValue to Record<string, any> safely
        const extraData = isRecord(extraFields) ? extraFields : {};

        return {
            ...rest,
            priceWholesale: product.priceWholesale,
            priceDrop: product.priceDrop,
            ...extraData,
        };
    });

    return { products: productsWithFields, total };
}

/**
 * Get all products (for static generation)
 */
export async function getAllProducts(): Promise<Product[]> {
    return prisma.product.findMany({
        where: { isActive: true },
        include: { category: true },
    });
}

/**
 * Get column definitions for a category
 */
export async function getColumnDefinitions(categorySlug: string): Promise<ColumnDefinition[]> {
    const category = await getCategoryBySlug(categorySlug);

    if (!category) return [];

    const fields = await prisma.productField.findMany({
        where: { categoryId: category.id },
        orderBy: { order: 'asc' },
    });

    // Core fields
    const coreColumns: ColumnDefinition[] = [
        { key: 'productName', label: 'Product Name', type: 'text' },
        { key: 'priceWholesale', label: 'Wholesale Price', type: 'price' },
        { key: 'priceDrop', label: 'Drop Price', type: 'price' },
        { key: 'description', label: 'Description', type: 'text' },
        { key: 'googleDriveUrl', label: 'Google Drive', type: 'url' },
    ];

    // Dynamic fields
    const dynamicColumns: ColumnDefinition[] = fields.map(field => ({
        key: field.key,
        label: field.label,
        type: mapFieldType(field.type),
        order: field.order,
    }));

    return [...coreColumns, ...dynamicColumns];
}

/**
 * Map Prisma FieldType to ColumnDefinition type
 */
function mapFieldType(fieldType: FieldType): ColumnDefinition['type'] {
    const typeMap: Record<FieldType, ColumnDefinition['type']> = {
        TEXT: 'text',
        NUMBER: 'number',
        PRICE: 'price',
        URL: 'url',
        DATE: 'date',
    };
    return typeMap[fieldType] || 'text';
}

/**
 * Get product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({
        where: { id },
        include: { category: true },
    });
}

/**
 * Search products across all categories
 */
export async function searchProducts(query: string, limit = 20): Promise<Product[]> {
    return prisma.product.findMany({
        where: {
            isActive: true,
            OR: [
                { productName: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
            ],
        },
        take: limit,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
    });
}

/**
 * Get category statistics
 */
export async function getCategoryStats(categorySlug: string) {
    const category = await getCategoryBySlug(categorySlug);

    if (!category) return null;

    const [totalProducts, avgPrices] = await Promise.all([
        prisma.product.count({ where: { categoryId: category.id, isActive: true } }),
        prisma.product.aggregate({
            where: { categoryId: category.id, isActive: true },
            _avg: { priceWholesale: true, priceDrop: true },
        }),
    ]);

    return {
        totalProducts,
        avgWholesale: avgPrices._avg.priceWholesale,
        avgDrop: avgPrices._avg.priceDrop,
    };
}