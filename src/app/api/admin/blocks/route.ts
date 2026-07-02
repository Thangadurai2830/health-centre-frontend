import type { NextRequest } from "next/server";

import { forwardSearchParams, proxyRead, proxyWrite } from "@/lib/server-admin/route-helpers";

export async function GET(request: NextRequest) {
  return proxyRead(`/api/v1/blocks${forwardSearchParams(request.url)}`);
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  return proxyWrite("/api/v1/blocks", { method: "POST", body });
}
