// components/product-table.tsx (оновлена версія з кнопкою додавання)
"use client";

import { useState, useMemo } from "react";
import { Search, X, Package, ChevronDown, ChevronUp, ExternalLink, Info, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ProductWithFields, ColumnDefinition } from "@/lib/types";
import { formatCurrency, calculateDiscount, isPriceField, isUrlField } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { useCart } from "@/lib/cart-context";
import { CartItem } from "@/lib/cart-db";

interface ProductTableProps {
    products: ProductWithFields[];
    columns: ColumnDefinition[];
    categoryName: string;
    totalCount?: number;
}

const CORE_FIELDS = ["productName", "priceWholesale", "priceDrop", "description", "googleDriveUrl"];

function toNumber(value: any): number {
    if (value instanceof Prisma.Decimal) {
        return value.toNumber();
    }
    if (typeof value === 'number') {
        return value;
    }
    const parsed = parseFloat(String(value));
    return isNaN(parsed) ? 0 : parsed;
}

export function ProductTable({ products, columns, categoryName, totalCount }: ProductTableProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
    const { addItem } = useCart();

    const extraColumns = useMemo(() => {
        return columns.filter((col) => !CORE_FIELDS.includes(col.key));
    }, [columns]);

    const filteredProducts = useMemo(() => {
        if (!searchQuery.trim()) {
            return products;
        }

        const query = searchQuery.toLowerCase().trim();

        return products.filter((product) => {
            return Object.entries(product).some(([key, value]) => {
                if (key === 'id' || key === 'categoryId' || key === 'createdAt' || key === 'updatedAt') {
                    return false;
                }

                if (typeof value === "string") {
                    return value.toLowerCase().includes(query);
                }
                if (typeof value === "number" || value instanceof Prisma.Decimal) {
                    return String(value).includes(query);
                }
                return false;
            });
        });
    }, [products, searchQuery]);

    const handleAddToCart = async (product: ProductWithFields) => {
        const cartItem: CartItem = {
            productId: product.id,
            productName: product.productName,
            categoryName: categoryName,
            priceWholesale: toNumber(product.priceWholesale),
            quantity: 1,
            extraFields: Object.fromEntries(
                extraColumns.map(col => [col.key, product[col.key]])
            ),
        };

        await addItem(cartItem);
        alert(`${product.productName} додано до кошика!`);
    };

    const toggleRowExpansion = (index: number) => {
        setExpandedRows((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    const expandAllRows = () => {
        setExpandedRows(new Set(filteredProducts.map((_, i) => i)));
    };

    const collapseAllRows = () => {
        setExpandedRows(new Set());
    };

    const handleClearSearch = () => {
        setSearchQuery("");
    };

    const renderValue = (key: string, value: any): React.ReactNode => {
        if (value === undefined || value === null || value === "") {
            return <span className="text-muted-foreground italic text-sm">—</span>;
        }

        const stringValue = String(value);

        if (isPriceField(key)) {
            const numValue = toNumber(value);
            return (
                <span className="font-semibold text-primary">
                    {formatCurrency(numValue)}
                </span>
            );
        }

        if (isUrlField(stringValue)) {
            return (
                <a
                    href={stringValue}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1 text-sm"
                >
                    Посилання
                    <ExternalLink className="h-3 w-3" />
                </a>
            );
        }

        return stringValue;
    };

    return (
        <div className="space-y-6">
            {/* Search Section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder={`Пошук в категорії ${categoryName.toLowerCase()}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-10"
                    />
                    {searchQuery && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleClearSearch}
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                        {filteredProducts.length} з {totalCount || products.length} товарів
                    </span>

                    {extraColumns.length > 0 && (
                        <>
                            <Button variant="outline" size="sm" onClick={expandAllRows} className="hidden sm:inline-flex">
                                Розгорнути всі
                            </Button>
                            <Button variant="outline" size="sm" onClick={collapseAllRows} className="hidden sm:inline-flex">
                                Згорнути всі
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Table Section */}
            {filteredProducts.length > 0 ? (
                <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                {extraColumns.length > 0 && (
                                    <TableHead className="w-12">
                                        <span className="sr-only">Розгорнути</span>
                                    </TableHead>
                                )}
                                <TableHead className="min-w-[200px]">Назва товару</TableHead>
                                <TableHead className="w-32 text-right">Гурт</TableHead>
                                <TableHead className="w-32 text-right">Дроп</TableHead>
                                <TableHead className="w-24 text-center">Маржа</TableHead>
                                <TableHead className="min-w-[250px]">Опис</TableHead>
                                <TableHead className="w-36 text-center">Google Drive</TableHead>
                                <TableHead className="w-32 text-center">Дія</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProducts.map((product, index) => {
                                const wholesale = toNumber(product.priceWholesale);
                                const drop = toNumber(product.priceDrop);
                                const margin = calculateDiscount(wholesale, drop);
                                const isExpanded = expandedRows.has(index);
                                const hasExtraData = extraColumns.length > 0;

                                return (
                                    <>
                                        <TableRow
                                            key={product.id}
                                            className={`${isExpanded ? "bg-muted/30" : ""}`}
                                        >
                                            {hasExtraData && (
                                                <TableCell className="w-12">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => toggleRowExpansion(index)}
                                                    >
                                                        {isExpanded ? (
                                                            <ChevronUp className="h-4 w-4" />
                                                        ) : (
                                                            <ChevronDown className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </TableCell>
                                            )}

                                            <TableCell className="font-medium">{product.productName}</TableCell>

                                            <TableCell className="text-right">
                                                <span className="font-bold text-lg text-primary">
                                                    {formatCurrency(wholesale)}
                                                </span>
                                            </TableCell>

                                            <TableCell className="text-right">
                                                <span className="font-medium text-muted-foreground">
                                                    {formatCurrency(drop)}
                                                </span>
                                            </TableCell>

                                            <TableCell className="text-center">
                                                {margin > 0 && (
                                                    <Badge
                                                        variant={
                                                            margin >= 50 ? "success" : margin >= 30 ? "secondary" : "outline"
                                                        }
                                                    >
                                                        {margin}%
                                                    </Badge>
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    {product.description}
                                                </p>
                                            </TableCell>

                                            <TableCell className="text-center">
                                                {product.googleDriveUrl && (
                                                    <a
                                                        href={product.googleDriveUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Button size="sm" variant="outline">
                                                            <ExternalLink className="mr-2 h-4 w-4" />
                                                            Відкрити
                                                        </Button>
                                                    </a>
                                                )}
                                            </TableCell>

                                            <TableCell className="text-center">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleAddToCart(product)}
                                                >
                                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                                    Додати
                                                </Button>
                                            </TableCell>
                                        </TableRow>

                                        {hasExtraData && isExpanded && (
                                            <TableRow key={`expanded-${product.id}`} className="bg-muted/20">
                                                <TableCell colSpan={8} className="p-0">
                                                    <div className="px-6 py-4 border-t border-dashed">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <Info className="h-4 w-4 text-primary" />
                                                            <span className="font-medium text-sm">
                                                                Додаткові характеристики
                                                            </span>
                                                        </div>
                                                        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                                            {extraColumns.map((column) => (
                                                                <div
                                                                    key={column.key}
                                                                    className="flex flex-col gap-1 rounded-lg bg-background p-3 border"
                                                                >
                                                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                                        {column.label}
                                                                    </span>
                                                                    <span className="text-sm font-medium">
                                                                        {renderValue(column.key, product[column.key])}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center rounded-lg border bg-card">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">Товарів не знайдено</h3>
                    <p className="mb-6 max-w-md text-sm text-muted-foreground">
                        За запитом &quot;<span className="font-medium">{searchQuery}</span>&quot; нічого не знайдено. Спробуйте змінити пошуковий запит.
                    </p>
                    <Button onClick={handleClearSearch} variant="outline" size="sm">
                        Очистити пошук
                    </Button>
                </div>
            )}

            {extraColumns.length > 0 && filteredProducts.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ChevronDown className="h-4 w-4" />
                    <span>Натисніть стрілку, щоб переглянути додаткові характеристики</span>
                </div>
            )}
        </div>
    );
}