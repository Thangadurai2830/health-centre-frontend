import { NextResponse } from "next/server";

import { BackendApiError, backendFetch } from "@/lib/auth/backend-client";
import { clearAuthCookies, getRefreshTokenCookie, setAccessTokenCookie } from "@/lib/auth/cookies";
import type { AccessTokenResponse } from "@/lib/auth/types";

export async function POST() {
  const refreshToken = await getRefreshTokenCookie();

  if (!refreshToken) {
    return NextResponse.json(
      { error_code: "unauthorized", message: "No refresh token" },
      { status: 401 },
    );
  }

  try {
    const data = await backendFetch<AccessTokenResponse>("/api/v1/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    await setAccessTokenCookie(data.access_token, data.expires_in);

    return NextResponse.json({ ok: true });
  } catch (error) {
    await clearAuthCookies();
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
