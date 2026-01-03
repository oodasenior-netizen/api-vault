// Utility for IndexedDB with AES-GCM encryption
const DB_NAME = "secureVault";
const STORE_NAME = "keys";
const PASSWORD = "Oodaguyx14$";

// Derive an encryption key from a password
async function deriveKey(password: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        "PBKDF2",
        false,
        ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: encoder.encode("salt"), // Use a unique salt per user
            iterations: 100000,
            hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
}

// Encrypt data
async function encryptData(key: CryptoKey, data: any): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12)); // Initialization vector
    const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        encoder.encode(JSON.stringify(data))
    );
    return new Uint8Array([...iv, ...new Uint8Array(encrypted)]).buffer; // Store IV with encrypted data
}

// Decrypt data
async function decryptData(key: CryptoKey, encryptedData: ArrayBuffer): Promise<any> {
    const data = new Uint8Array(encryptedData);
    const iv = data.slice(0, 12); // Extract IV
    const encrypted = data.slice(12); // Extract encrypted content
    const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        encrypted
    );
    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(decrypted));
}

// Open IndexedDB
async function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Store encrypted data in IndexedDB
export async function storeEncryptedData(id: string, data: any) {
    const key = await deriveKey(PASSWORD);
    const db = await openDB();
    const encryptedData = await encryptData(key, data);
    const transaction = db.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put(encryptedData, id);
    await transaction.done;
}

// Retrieve and decrypt data from IndexedDB
export async function retrieveDecryptedData(id: string): Promise<any> {
    const key = await deriveKey(PASSWORD);
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, "readonly");
    const encryptedData = await transaction.objectStore(STORE_NAME).get(id);
    if (!encryptedData) return null;
    return await decryptData(key, encryptedData);
}