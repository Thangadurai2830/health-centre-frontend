import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decodeJwt } from "jose";

import { ACCESS_TOKEN_COOKIE, LOGIN_PATH } from "@/lib/auth/constants";
import type { AccessTokenClaims } from "@/lib/auth/types";

export interface Session {
  claims: AccessTokenClaims;
  accessToken: string;
}

function isExpired(claims: AccessTokenClaims): boolean {
  return claims.exp * 1000 <= Date.now();
}

export const getSession = cache(async (): Promise<Session | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  if (!token) return null;

  try {
    const claims = decodeJwt(token) as unknown as AccessTokenClaims;
    if (isExpired(claims)) return null;
    return { claims, accessToken: token };
  } catch {
    return null;
  }
});

export async function verifySession(): Promise<Session> {
  const session = await getSession();
  if (!session) {
    redirect(LOGIN_PATH);
  }
  return session;
}
