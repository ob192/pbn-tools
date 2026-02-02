// lib/cart-db.ts
import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface CartItem {
    productId: string;
    productName: string;
    categoryName: string;
    priceWholesale: number;
    quantity: number;
    extraFields?: Record<string, any>;
}

interface CartDB extends DBSchema {
    cart: {
        key: string;
        value: CartItem;
    };
}

const DB_NAME = 'pudra-cart';
const STORE_NAME = 'cart';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<CartDB>> | null = null;

function getDB() {
    if (!dbPromise) {
        dbPromise = openDB<CartDB>(DB_NAME, DB_VERSION, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: 'productId' });
                }
            },
        });
    }
    return dbPromise;
}

export async function addToCart(item: CartItem): Promise<void> {
    const db = await getDB();
    const existing = await db.get(STORE_NAME, item.productId);

    if (existing) {
        existing.quantity += item.quantity;
        await db.put(STORE_NAME, existing);
    } else {
        await db.put(STORE_NAME, item);
    }
}

export async function removeFromCart(productId: string): Promise<void> {
    const db = await getDB();
    await db.delete(STORE_NAME, productId);
}

export async function updateCartItemQuantity(
    productId: string,
    quantity: number
): Promise<void> {
    const db = await getDB();
    const item = await db.get(STORE_NAME, productId);

    if (item) {
        if (quantity <= 0) {
            await db.delete(STORE_NAME, productId);
        } else {
            item.quantity = quantity;
            await db.put(STORE_NAME, item);
        }
    }
}

export async function getCartItems(): Promise<CartItem[]> {
    const db = await getDB();
    return db.getAll(STORE_NAME);
}

export async function clearCart(): Promise<void> {
    const db = await getDB();
    await db.clear(STORE_NAME);
}

export async function getCartTotal(): Promise<number> {
    const items = await getCartItems();
    return items.reduce((sum, item) => sum + item.priceWholesale * item.quantity, 0);
}