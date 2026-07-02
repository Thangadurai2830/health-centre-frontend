import type { NextRequest } from "next/server";

import { forwardSearchParams, proxyRead } from "@/lib/server-admin/route-helpers";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  return proxyRead(`/api/v1/staff/health-centre/${id}${forwardSearchParams(request.url)}`);
}
