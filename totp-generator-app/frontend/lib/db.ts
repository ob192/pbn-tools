const DB_NAME = 'totp-secrets-db';
const DB_VERSION = 1;
const STORE_NAME = 'secrets';

export interface SavedSecret {
    id: string;
    title: string;
    secret: string;
    createdAt: number;
    updatedAt: number;
    isFavorite: boolean;
    color?: string;
    notes?: string;
}

export type NewSecret = Omit<SavedSecret, 'id' | 'createdAt' | 'updatedAt'>;

function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        if (typeof indexedDB === 'undefined') {
            reject(new Error('IndexedDB not supported'));
            return;
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                store.createIndex('title', 'title', { unique: false });
                store.createIndex('createdAt', 'createdAt', { unique: false });
                store.createIndex('isFavorite', 'isFavorite', { unique: false });
            }
        };
    });
}

export async function getAllSecrets(): Promise<SavedSecret[]> {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const secrets = request.result as SavedSecret[];
                // Sort by favorite first, then by creation date (newest first)
                secrets.sort((a, b) => {
                    if (a.isFavorite !== b.isFavorite) {
                        return a.isFavorite ? -1 : 1;
                    }
                    return b.createdAt - a.createdAt;
                });
                resolve(secrets);
            };
        });
    } catch {
        return [];
    }
}

export async function getSecret(id: string): Promise<SavedSecret | undefined> {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(id);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result as SavedSecret | undefined);
        });
    } catch {
        return undefined;
    }
}

export async function findSecretByValue(secretValue: string): Promise<SavedSecret | undefined> {
    const all = await getAllSecrets();
    return all.find(s => s.secret.replace(/\s/g, '').toUpperCase() === secretValue.replace(/\s/g, '').toUpperCase());
}

export async function saveSecret(secret: NewSecret): Promise<SavedSecret> {
    const db = await openDB();
    const now = Date.now();
    const newSecret: SavedSecret = {
        ...secret,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
    };

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.add(newSecret);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(newSecret);
    });
}

export async function updateSecret(
    id: string,
    updates: Partial<Omit<SavedSecret, 'id' | 'createdAt'>>
): Promise<SavedSecret | undefined> {
    const db = await openDB();
    const existing = await getSecret(id);

    if (!existing) return undefined;

    const updatedSecret: SavedSecret = {
        ...existing,
        ...updates,
        updatedAt: Date.now(),
    };

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(updatedSecret);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(updatedSecret);
    });
}

export async function deleteSecret(id: string): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
    });
}

export async function toggleFavorite(id: string): Promise<SavedSecret | undefined> {
    const existing = await getSecret(id);
    if (!existing) return undefined;

    return updateSecret(id, { isFavorite: !existing.isFavorite });
}

// URL encoding/decoding for sharing
export function encodeSecretForUrl(secret: string): string {
    return encodeURIComponent(secret.replace(/\s/g, '').toUpperCase());
}

export function decodeSecretFromUrl(encoded: string): string {
    try {
        return decodeURIComponent(encoded).toUpperCase();
    } catch {
        return encoded.toUpperCase();
    }
}