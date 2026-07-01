import { NextResponse } from "next/server";

import { backendFetch } from "@/lib/auth/backend-client";
import { clearAuthCookies, getRefreshTokenCookie } from "@/lib/auth/cookies";

export async function POST() {
  const refreshToken = await getRefreshTokenCookie();

  if (refreshToken) {
    await backendFetch("/api/v1/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    }).catch(() => null);
  }

  await clearAuthCookies();
  return NextResponse.json({ ok: true });
}
