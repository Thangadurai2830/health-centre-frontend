import { NextResponse } from "next/server";

import { BackendApiError, backendFetch } from "@/lib/auth/backend-client";
import { getAccessTokenCookie } from "@/lib/auth/cookies";
import type { UserProfile } from "@/lib/auth/types";

export async function GET() {
  const accessToken = await getAccessTokenCookie();

  if (!accessToken) {
    return NextResponse.json(
      { error_code: "unauthorized", message: "Not authenticated" },
      { status: 401 },
    );
  }

  try {
    const user = await backendFetch<UserProfile>("/api/v1/auth/me", { accessToken });
    return NextResponse.json(user);
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
