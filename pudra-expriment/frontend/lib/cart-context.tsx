// lib/cart-context.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, addToCart as dbAddToCart, getCartItems, removeFromCart as dbRemoveFromCart, updateCartItemQuantity, clearCart as dbClearCart, getCartTotal } from './cart-db';

interface CartContextType {
    items: CartItem[];
    totalAmount: number;
    isCartOpen: boolean;
    addItem: (item: CartItem) => Promise<void>;
    removeItem: (productId: string) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    openCart: () => void;
    closeCart: () => void;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const refreshCart = useCallback(async () => {
        const cartItems = await getCartItems();
        const total = await getCartTotal();
        setItems(cartItems);
        setTotalAmount(total);
    }, []);

    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    const addItem = async (item: CartItem) => {
        await dbAddToCart(item);
        await refreshCart();
    };

    const removeItem = async (productId: string) => {
        await dbRemoveFromCart(productId);
        await refreshCart();
    };

    const updateQuantity = async (productId: string, quantity: number) => {
        await updateCartItemQuantity(productId, quantity);
        await refreshCart();
    };

    const clearCart = async () => {
        await dbClearCart();
        await refreshCart();
    };

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    return (
        <CartContext.Provider
            value={{
                items,
                totalAmount,
                isCartOpen,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                openCart,
                closeCart,
                refreshCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
}