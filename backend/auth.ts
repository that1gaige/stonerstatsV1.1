import { sign, verify } from "hono/jwt";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey-change-in-production";

export interface JWTPayload {
  userId: string;
  exp: number;
  [key: string]: unknown;
}

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + JWT_SECRET);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

export async function generateToken(userId: string): Promise<string> {
  const payload = {
    userId,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
  };
  return await sign(payload, JWT_SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const payload = await verify(token, JWT_SECRET);
    if (payload && typeof payload === 'object' && 'userId' in payload) {
      return payload as JWTPayload;
    }
    return null;
  } catch {
    return null;
  }
}
