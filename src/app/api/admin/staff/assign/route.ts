import type { NextRequest } from "next/server";

import { proxyWrite } from "@/lib/server-admin/route-helpers";

export async function POST(request: NextRequest) {
  const body = await request.text();
  return proxyWrite("/api/v1/staff/assign", { method: "POST", body });
}
