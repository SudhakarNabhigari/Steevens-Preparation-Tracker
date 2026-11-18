// Cryptographic helpers using Web Crypto API (works in browser, Node >= 20, Vercel, and Deno)

export function constantTimeEqual(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const aBytes = encoder.encode(a);
  const bBytes = encoder.encode(b);
  const maxLen = Math.max(aBytes.length, bBytes.length);
  let diff = aBytes.length ^ bBytes.length;

  for (let i = 0; i < maxLen; i++) {
    const av = i < aBytes.length ? aBytes[i] : 0;
    const bv = i < bBytes.length ? bBytes[i] : 0;
    diff |= av ^ bv;
  }

  return diff === 0;
}

export async function sha256Hex(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const digest = await globalThis.crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

const OWNER_TRANSITION_SALT = 'steeven_prep_owner_v1';
const GUEST_LOCAL_SALT = 'steeven_prep_guest_v1';

// One-way SHA-256 verifier digests (never plaintext passwords; Owner transition digests are strictly
// disabled once Supabase Auth is configured in production).
const OWNER_TRANSITION_DIGESTS = [
  '388150ec50348e8d23f474adb3e78b94b631287fa40a958dc49b090c4bae98b1',
  'a0b1ec4bfd7c085ba96aaf6f43cfefa5b6103a8f943d46bea1f6b7df7b419d25'
];

const GUEST_LOCAL_DIGEST = '3ca3bd3a18db302de936682c41cabb083f24cdcc53e449c7afcbfab1380e85b9';

export async function computeOwnerTransitionVerifier(password: string): Promise<string> {
  return sha256Hex(`${OWNER_TRANSITION_SALT}:${password}`);
}

export async function verifyOwnerTransitionPassword(
  password: string,
  storedVerifier?: string,
  legacyPlaintextFromStorage?: string
): Promise<boolean> {
  if (!password) return false;
  const candidateDigest = await computeOwnerTransitionVerifier(password);

  if (storedVerifier && constantTimeEqual(candidateDigest, storedVerifier)) {
    return true;
  }

  if (legacyPlaintextFromStorage) {
    const legacyDigest = await computeOwnerTransitionVerifier(legacyPlaintextFromStorage);
    if (constantTimeEqual(candidateDigest, legacyDigest)) {
      return true;
    }
  }

  return OWNER_TRANSITION_DIGESTS.some(d => constantTimeEqual(candidateDigest, d));
}

export async function verifyGuestLocalPassword(password: string): Promise<boolean> {
  if (!password) return false;
  const candidateDigest = await sha256Hex(`${GUEST_LOCAL_SALT}:${password}`);
  return constantTimeEqual(candidateDigest, GUEST_LOCAL_DIGEST);
}
