import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";

import { ACCESS_TOKEN_COOKIE, DEFAULT_APP_PATH, LOGIN_PATH } from "@/lib/auth/constants";
import type { AccessTokenClaims } from "@/lib/auth/types";

function hasValidSession(request: NextRequest): boolean {
  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  if (!token) return false;

  try {
    const claims = decodeJwt(token) as unknown as AccessTokenClaims;
    return claims.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = hasValidSession(request);

  if (pathname.startsWith("/app") && !isAuthenticated) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === LOGIN_PATH && isAuthenticated) {
    return NextResponse.redirect(new URL(DEFAULT_APP_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/login"],
};
