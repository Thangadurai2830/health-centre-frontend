import { NextResponse } from "next/server";

import { BackendApiError, backendFetch } from "@/lib/auth/backend-client";
import { setAccessTokenCookie, setRefreshTokenCookie } from "@/lib/auth/cookies";
import type { TokenResponse } from "@/lib/auth/types";

export async function POST(request: Request) {
  const payload = await request.json();

  try {
    const data = await backendFetch<TokenResponse>("/api/v1/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    await setAccessTokenCookie(data.access_token, data.expires_in);
    await setRefreshTokenCookie(data.refresh_token);

    return NextResponse.json({
      is_new_user: data.is_new_user,
      user: data.user,
    });
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
