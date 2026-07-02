import type { NextRequest } from "next/server";

import { forwardSearchParams, proxyRead } from "@/lib/server-admin/route-helpers";

export async function GET(request: NextRequest) {
  return proxyRead(`/api/v1/lookups/specializations${forwardSearchParams(request.url)}`);
}
