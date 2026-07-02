import type { NextRequest } from "next/server";

import { proxyRead, proxyWrite } from "@/lib/server-admin/route-helpers";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  return proxyRead(`/api/v1/rooms/${id}`);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const body = await request.text();
  return proxyWrite(`/api/v1/rooms/${id}`, { method: "PUT", body });
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  return proxyWrite(`/api/v1/rooms/${id}`, { method: "DELETE" });
}
