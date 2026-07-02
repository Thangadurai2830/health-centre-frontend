import "server-only";

import { NextResponse } from "next/server";

import { BackendApiError, backendFetch } from "@/lib/auth/backend-client";
import { getAccessTokenCookie } from "@/lib/auth/cookies";
import { canManageMasterData } from "@/lib/auth/rbac";
import { decodeAccessToken } from "@/lib/server-admin/token";

export function unauthorized(): NextResponse {
  return NextResponse.json(
    { error_code: "unauthorized", message: "Not authenticated" },
    { status: 401 },
  );
}

export function forbidden(): NextResponse {
  return NextResponse.json(
    { error_code: "forbidden", message: "You do not have permission to perform this action" },
    { status: 403 },
  );
}

async function proxy<T>(fn: () => Promise<T>): Promise<NextResponse> {
  try {
    const data = await fn();
    return NextResponse.json(data ?? {});
  } catch (error) {
    if (error instanceof BackendApiError) {
      return NextResponse.json(
        { error_code: error.errorCode, message: error.message },
        { status: error.status },
      );
    }
    return NextResponse.json(
      { error_code: "internal_error", message: "Something went wrong" },
      { status: 500 },
    );
  }
}

/** Proxies a read-only (GET) request. Any authenticated role may call this. */
export async function proxyRead<T>(backendPath: string): Promise<NextResponse> {
  const accessToken = await getAccessTokenCookie();
  if (!accessToken) return unauthorized();
  return proxy<T>(() => backendFetch<T>(backendPath, { accessToken }));
}

/** Proxies a write (POST/PUT/DELETE) request. Requires district_admin/super_admin. */
export async function proxyWrite<T>(
  backendPath: string,
  init: RequestInit,
): Promise<NextResponse> {
  const accessToken = await getAccessTokenCookie();
  if (!accessToken) return unauthorized();

  const claims = decodeAccessToken(accessToken);
  if (!claims || !canManageMasterData(claims.role)) return forbidden();

  return proxy<T>(() => backendFetch<T>(backendPath, { ...init, accessToken }));
}

export function forwardSearchParams(requestUrl: string): string {
  const { search } = new URL(requestUrl);
  return search;
}
