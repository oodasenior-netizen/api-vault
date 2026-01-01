
/**
 * Generates a SHA-256 hash of a string.
 */
export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Basic encryption/decryption simulator using Base64 and a salt (for UI demonstration purposes).
 * In a real production app, this would use SubtleCrypto with the user's password derived key.
 */
export const obfuscate = (text: string): string => btoa(text);
export const deobfuscate = (encoded: string): string => atob(encoded);
