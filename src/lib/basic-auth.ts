function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

const BASIC_PREFIX = /^Basic\s+/i;

/** Decodes the base64 payload of a Basic header as UTF-8; null if malformed. */
export function decodeBasicCredentials(header: string): string | null {
  if (!BASIC_PREFIX.test(header)) return null;
  try {
    const binary = atob(header.replace(BASIC_PREFIX, "").trim());
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return null;
  }
}

/** Compares the header's UTF-8 decoded credentials to user:pass in constant time. */
export function isValidBasicAuth(header: string, user: string, pass: string): boolean {
  const decoded = decodeBasicCredentials(header);
  return decoded !== null && constantTimeEqual(decoded, `${user}:${pass}`);
}

export type AuditAccess = "allowed" | "unconfigured" | "denied";

/** Fail closed: missing credentials config denies in every environment. */
export function checkAuditAccess(
  user: string | undefined,
  pass: string | undefined,
  header: string,
): AuditAccess {
  if (!user || !pass) return "unconfigured";
  return isValidBasicAuth(header, user, pass) ? "allowed" : "denied";
}
