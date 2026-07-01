import { NextResponse } from "next/server";

import { backendFetch } from "@/lib/auth/backend-client";
import { clearAuthCookies, getAccessTokenCookie } from "@/lib/auth/cookies";

export async function POST() {
  const accessToken = await getAccessTokenCookie();

  if (accessToken) {
    await backendFetch("/api/v1/auth/logout-all", {
      method: "POST",
      accessToken,
    }).catch(() => null);
  }

  await clearAuthCookies();
  return NextResponse.json({ ok: true });
}
