// components/cart-drawer.tsx
"use client";

import { X, Plus, Minus, Trash2, Copy, Download } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function CartDrawer() {
    const { items, totalAmount, isCartOpen, closeCart, updateQuantity, removeItem, clearCart } = useCart();

    const generateCSV = () => {
        if (items.length === 0) return '';

        const headers = ['Товар', 'Категорія', 'Ціна за од.', 'Кількість', 'Сума'];
        const rows = items.map(item => [
            item.productName,
            item.categoryName,
            item.priceWholesale.toFixed(2),
            item.quantity.toString(),
            (item.priceWholesale * item.quantity).toFixed(2),
        ]);

        rows.push(['', '', '', 'РАЗОМ:', totalAmount.toFixed(2)]);

        const csv = [headers, ...rows]
            .map(row => row.join(','))
            .join('\n');

        return csv;
    };

    const generateTextOrder = () => {
        if (items.length === 0) return '';

        let text = '📋 ЗАМОВЛЕННЯ PUDRA\n\n';

        items.forEach((item, index) => {
            text += `${index + 1}. ${item.productName}\n`;
            text += `   Категорія: ${item.categoryName}\n`;
            text += `   Ціна: ${formatCurrency(item.priceWholesale)}\n`;
            text += `   Кількість: ${item.quantity} шт.\n`;
            text += `   Сума: ${formatCurrency(item.priceWholesale * item.quantity)}\n\n`;
        });

        text += `━━━━━━━━━━━━━━━━━━\n`;
        text += `💰 РАЗОМ: ${formatCurrency(totalAmount)}\n`;

        return text;
    };

    const copyToClipboard = async () => {
        const text = generateTextOrder();
        await navigator.clipboard.writeText(text);
        alert('Замовлення скопійовано в буфер обміну!');
    };

    const downloadCSV = () => {
        const csv = generateCSV();
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `pudra-order-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    if (!isCartOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                onClick={closeCart}
            />

            {/* Drawer */}
            <div className="fixed right-0 top-0 bottom-0 w-full sm:w-[500px] bg-background z-50 shadow-2xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="text-lg font-bold">Кошик</h2>
                    <Button variant="ghost" size="icon" onClick={closeCart}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <p className="text-muted-foreground mb-4">Кошик порожній</p>
                            <Button onClick={closeCart}>Додати товари</Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.productId}
                                    className="border rounded-lg p-4 space-y-3"
                                >
                                    <div className="flex justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-medium">{item.productName}</h3>
                                            <Badge variant="secondary" className="mt-1">
                                                {item.categoryName}
                                            </Badge>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeItem(item.productId)}
                                            className="text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <span className="w-12 text-center font-medium">
                                                {item.quantity}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                            >
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-muted-foreground">
                                                {formatCurrency(item.priceWholesale)} × {item.quantity}
                                            </div>
                                            <div className="font-bold text-primary">
                                                {formatCurrency(item.priceWholesale * item.quantity)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t p-4 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold">Разом:</span>
                            <span className="text-2xl font-bold text-primary">
                                {formatCurrency(totalAmount)}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                variant="outline"
                                onClick={copyToClipboard}
                                className="w-full"
                            >
                                <Copy className="mr-2 h-4 w-4" />
                                Копіювати
                            </Button>
                            <Button
                                variant="outline"
                                onClick={downloadCSV}
                                className="w-full"
                            >
                                <Download className="mr-2 h-4 w-4" />
                                CSV
                            </Button>
                        </div>

                        <Button
                            variant="destructive"
                            onClick={clearCart}
                            className="w-full"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Очистити кошик
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}