// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { categorySlug, productName, priceWholesale, priceDrop, description, googleDriveUrl, extraFields } = body;

        // Validate required fields
        if (!categorySlug || !productName || !priceWholesale || !priceDrop) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Find category
        const category = await prisma.category.findUnique({
            where: { slug: categorySlug },
        });

        if (!category) {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            );
        }

        // Create product
        const product = await prisma.product.create({
            data: {
                productName,
                priceWholesale,
                priceDrop,
                description: description || '',
                googleDriveUrl,
                extraFields,
                categoryId: category.id,
            },
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const categorySlug = searchParams.get('category');
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1');
        const pageSize = parseInt(searchParams.get('pageSize') || '50');

        const where: any = {
            isActive: true,
        };

        if (categorySlug) {
            const category = await prisma.category.findUnique({
                where: { slug: categorySlug },
            });

            if (category) {
                where.categoryId = category.id;
            }
        }

        if (search) {
            where.OR = [
                { productName: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
                include: {
                    category: true,
                },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.product.count({ where }),
        ]);

        return NextResponse.json({
            products,
            pagination: {
                page,
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize),
            },
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}