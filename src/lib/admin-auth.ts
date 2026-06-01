import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

const DEFAULT_TTL_SECONDS = 60 * 60 * 24;

type AdminSessionPayload = {
  role: "admin";
  exp: number;
};

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET;
}

function getSessionTtlSeconds() {
  const raw = Number(process.env.ADMIN_SESSION_TTL_SECONDS);
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_TTL_SECONDS;
}

function toBase64Url(value: string | Buffer) {
  return Buffer.from(value).toString("base64url");
}

function sign(value: string) {
  const secret = getSessionSecret();
  if (!secret) return null;
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function secureCompare(a: string, b: string) {
  const left = createHash("sha256").update(a).digest();
  const right = createHash("sha256").update(b).digest();
  return timingSafeEqual(left, right);
}

export function validateAdminPassword(password: string) {
  const configuredPassword = process.env.ADMIN_PASSWORD;
  const configuredSecret = getSessionSecret();
  if (!configuredPassword || !configuredSecret) return false;
  return secureCompare(password, configuredPassword);
}

export function createAdminToken() {
  const expiresAt = Math.floor(Date.now() / 1000) + getSessionTtlSeconds();
  const payload: AdminSessionPayload = { role: "admin", exp: expiresAt };
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = sign(encodedPayload);
  if (!signature) return null;
  return { token: `${encodedPayload}.${signature}`, expiresAt };
}

export function verifyAdminToken(token: string | null | undefined) {
  if (!token) return false;

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return false;

  const expectedSignature = sign(encodedPayload);
  if (!expectedSignature || !secureCompare(signature, expectedSignature)) return false;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as AdminSessionPayload;
    return payload.role === "admin" && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function getAdminTokenFromRequest(req: NextRequest) {
  const authorization = req.headers.get("authorization");
  if (authorization?.startsWith("Bearer ")) {
    return authorization.slice("Bearer ".length);
  }
  return req.headers.get("x-admin-token");
}

export function isAdminRequest(req: NextRequest) {
  return verifyAdminToken(getAdminTokenFromRequest(req));
}
