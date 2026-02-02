import { PrismaClient, FieldType } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Start Seeding ---');

    // 1. Clean the database (Optional - be careful in production!)
    await prisma.productField.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();

    // 2. Define some Category templates
    const categoriesData = [
        { name: 'Electronics', slug: 'electronics' },
        { name: 'Fashion', slug: 'fashion' },
        { name: 'Home & Garden', slug: 'home-garden' },
    ];

    for (const cat of categoriesData) {
        const category = await prisma.category.create({
            data: {
                name: cat.name,
                slug: cat.slug,
                description: faker.commerce.productDescription(),
                // 3. Create Custom Fields for each category
                fields: {
                    create: [
                        { key: 'brand', label: 'Brand Name', type: FieldType.TEXT, order: 1 },
                        { key: 'warranty_period', label: 'Warranty (Months)', type: FieldType.NUMBER, order: 2 },
                    ],
                },
            },
            include: { fields: true },
        });

        console.log(`Created category: ${category.name}`);

        // 4. Create Dummy Products for this category
        const productsToCreate = 5;
        for (let i = 0; i < productsToCreate; i++) {
            await prisma.product.create({
                data: {
                    productName: faker.commerce.productName(),
                    priceWholesale: faker.commerce.price({ min: 10, max: 100 }),
                    priceDrop: faker.commerce.price({ min: 5, max: 50 }),
                    description: faker.commerce.productDescription(),
                    googleDriveUrl: faker.internet.url(),
                    categoryId: category.id,
                    isActive: faker.datatype.boolean(0.8), // 80% chance of being active
                    // Populate extraFields based on the keys we defined above
                    extraFields: {
                        brand: faker.company.name(),
                        warranty_period: faker.number.int({ min: 6, max: 36 }),
                    },
                },
            });
        }
        console.log(`  -> Added ${productsToCreate} products to ${category.name}`);
    }

    console.log('--- Seeding Finished ---');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });