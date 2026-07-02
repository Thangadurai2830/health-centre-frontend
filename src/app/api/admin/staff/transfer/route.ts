import type { NextRequest } from "next/server";

import { proxyWrite } from "@/lib/server-admin/route-helpers";

export async function PUT(request: NextRequest) {
  const body = await request.text();
  return proxyWrite("/api/v1/staff/transfer", { method: "PUT", body });
}
