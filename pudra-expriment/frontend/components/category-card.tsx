import Link from "next/link";
import { ArrowRight, Package, Shirt, Cpu, Wrench, Home, Car } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Category } from "@/lib/types";

interface CategoryCardProps {
    category: Category;
}

/**
 * Maps category names to appropriate icons
 * Extensible - add more mappings as needed
 */
function getCategoryIcon(categoryName: string) {
    const iconMap: Record<string, React.ReactNode> = {
        electronics: <Cpu className="h-8 w-8" />,
        clothing: <Shirt className="h-8 w-8" />,
        tools: <Wrench className="h-8 w-8" />,
        home: <Home className="h-8 w-8" />,
        automotive: <Car className="h-8 w-8" />,
    };

    const key = categoryName.toLowerCase();
    return iconMap[key] || <Package className="h-8 w-8" />;
}

/**
 * Card component for displaying a category
 * Server Component - renders at build time
 */
export function CategoryCard({ category }: CategoryCardProps) {
    return (
        <Link href={`/category/${category.slug}`}>
            <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 cursor-pointer border-muted">
                <CardHeader className="pb-4">
                    {/* Icon with gradient background */}
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary transition-transform group-hover:scale-110">
                        {getCategoryIcon(category.name)}
                    </div>

                    <CardTitle className="flex items-center justify-between text-xl">
                        {category.name}
                        <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                    </CardTitle>

                    <CardDescription>
                        Browse our selection of {category.name.toLowerCase()} products
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Badge variant="secondary" className="font-medium">
                        {category.productCount} {category.productCount === 1 ? "product" : "products"}
                    </Badge>
                </CardContent>
            </Card>
        </Link>
    );
}