import "server-only";

import { decodeJwt } from "jose";

import type { AccessTokenClaims } from "@/lib/auth/types";

export function decodeAccessToken(token: string): AccessTokenClaims | null {
  try {
    return decodeJwt(token) as unknown as AccessTokenClaims;
  } catch {
    return null;
  }
}
