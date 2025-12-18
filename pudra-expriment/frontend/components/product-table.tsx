"use client";

import { useState, useMemo } from "react";
import {
    Search,
    X,
    Package,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    Info
} from "lucide-react";
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
import { Product, ColumnDefinition } from "@/lib/types";
import {
    formatCurrency,
    calculateDiscount,
    isPriceField,
    isUrlField,
    formatFieldName
} from "@/lib/utils";

interface ProductTableProps {
    products: Product[];
    columns: ColumnDefinition[];
    categoryName: string;
}

/**
 * Core fields that are always shown in the main table
 */
const CORE_FIELDS = ["productName", "priceWholesale", "priceDrop", "description", "googleDriveUrl"];

/**
 * Client component for displaying products in a searchable table
 * with expandable rows for extra data
 */
export function ProductTable({ products, columns, categoryName }: ProductTableProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

    /**
     * Get extra columns (non-core fields)
     */
    const extraColumns = useMemo(() => {
        return columns.filter((col) => !CORE_FIELDS.includes(col.key));
    }, [columns]);

    /**
     * Memoized filtering function
     * Searches across ALL string fields dynamically
     */
    const filteredProducts = useMemo(() => {
        if (!searchQuery.trim()) {
            return products;
        }

        const query = searchQuery.toLowerCase().trim();

        return products.filter((product) => {
            return Object.entries(product).some(([, value]) => {
                if (typeof value === "string") {
                    return value.toLowerCase().includes(query);
                }
                if (typeof value === "number") {
                    return value.toString().includes(query);
                }
                return false;
            });
        });
    }, [products, searchQuery]);

    /**
     * Toggle row expansion
     */
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

    /**
     * Expand all rows
     */
    const expandAllRows = () => {
        setExpandedRows(new Set(filteredProducts.map((_, i) => i)));
    };

    /**
     * Collapse all rows
     */
    const collapseAllRows = () => {
        setExpandedRows(new Set());
    };

    /**
     * Clear search
     */
    const handleClearSearch = () => {
        setSearchQuery("");
    };

    /**
     * Render a cell value based on its type
     */
    const renderValue = (key: string, value: string | number | undefined): React.ReactNode => {
        if (value === undefined || value === "") {
            return <span className="text-muted-foreground italic text-sm">—</span>;
        }

        const stringValue = String(value);

        if (isPriceField(key)) {
            return (
                <span className="font-semibold text-primary">
          {formatCurrency(parseFloat(stringValue))}
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
                    Open Link
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
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder={`Search ${categoryName.toLowerCase()}...`}
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

                {/* Controls */}
                <div className="flex items-center gap-2">
                    {/* Result Count */}
                    <span className="text-sm text-muted-foreground">
            {filteredProducts.length} of {products.length} products
          </span>

                    {/* Expand/Collapse All (only if extra columns exist) */}
                    {extraColumns.length > 0 && (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={expandAllRows}
                                className="hidden sm:inline-flex"
                            >
                                Expand All
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={collapseAllRows}
                                className="hidden sm:inline-flex"
                            >
                                Collapse All
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
                                        <span className="sr-only">Expand</span>
                                    </TableHead>
                                )}
                                <TableHead className="min-w-[200px]">Product Name</TableHead>
                                <TableHead className="w-32 text-right">Wholesale</TableHead>
                                <TableHead className="w-32 text-right">Drop Price</TableHead>
                                <TableHead className="w-24 text-center">Margin</TableHead>
                                <TableHead className="min-w-[250px]">Description</TableHead>
                                <TableHead className="w-36 text-center">Google Drive</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProducts.map((product, index) => {
                                const wholesale = parseFloat(String(product.priceWholesale));
                                const drop = parseFloat(String(product.priceDrop));
                                const margin = calculateDiscount(wholesale, drop);
                                const isExpanded = expandedRows.has(index);
                                const hasExtraData = extraColumns.length > 0;

                                return (
                                    <>
                                        {/* Main Row */}
                                        <TableRow
                                            key={`row-${index}`}
                                            className={`${isExpanded ? "bg-muted/30" : ""} ${
                                                hasExtraData ? "cursor-pointer hover:bg-muted/50" : ""
                                            }`}
                                            onClick={() => hasExtraData && toggleRowExpansion(index)}
                                        >
                                            {/* Expand Button */}
                                            {hasExtraData && (
                                                <TableCell className="w-12">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleRowExpansion(index);
                                                        }}
                                                    >
                                                        {isExpanded ? (
                                                            <ChevronUp className="h-4 w-4" />
                                                        ) : (
                                                            <ChevronDown className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </TableCell>
                                            )}

                                            {/* Product Name */}
                                            <TableCell className="font-medium">
                                                {product.productName}
                                            </TableCell>

                                            {/* Wholesale Price */}
                                            <TableCell className="text-right">
                        <span className="font-bold text-lg text-primary">
                          {formatCurrency(wholesale)}
                        </span>
                                            </TableCell>

                                            {/* Drop Price */}
                                            <TableCell className="text-right">
                        <span className="font-medium text-muted-foreground">
                          {formatCurrency(drop)}
                        </span>
                                            </TableCell>

                                            {/* Margin Badge */}
                                            <TableCell className="text-center">
                                                {margin > 0 && (
                                                    <Badge
                                                        variant={margin >= 50 ? "success" : margin >= 30 ? "secondary" : "outline"}
                                                    >
                                                        {margin}%
                                                    </Badge>
                                                )}
                                            </TableCell>

                                            {/* Description */}
                                            <TableCell>
                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    {product.description}
                                                </p>
                                            </TableCell>

                                            {/* Google Drive Button */}
                                            <TableCell className="text-center">
                                                <a
                                                    href={product.googleDriveUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Button size="sm" variant="default">
                                                        <ExternalLink className="mr-2 h-4 w-4" />
                                                        Open
                                                    </Button>
                                                </a>
                                            </TableCell>
                                        </TableRow>

                                        {/* Expanded Row - Extra Data */}
                                        {hasExtraData && isExpanded && (
                                            <TableRow key={`expanded-${index}`} className="bg-muted/20">
                                                <TableCell colSpan={7} className="p-0">
                                                    <div className="px-6 py-4 border-t border-dashed">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <Info className="h-4 w-4 text-primary" />
                                                            <span className="font-medium text-sm">
                                Additional Specifications
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
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-16 text-center rounded-lg border bg-card">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">No products found</h3>
                    <p className="mb-6 max-w-md text-sm text-muted-foreground">
                        No products match "<span className="font-medium">{searchQuery}</span>".
                        Try adjusting your search.
                    </p>
                    <Button onClick={handleClearSearch} variant="outline" size="sm">
                        Clear Search
                    </Button>
                </div>
            )}

            {/* Legend for Extra Columns */}
            {extraColumns.length > 0 && filteredProducts.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ChevronDown className="h-4 w-4" />
                    <span>Click on a row to view additional specifications</span>
                </div>
            )}
        </div>
    );
}