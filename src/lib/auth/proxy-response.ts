import "server-only";

import { NextResponse } from "next/server";

import { BackendApiError } from "@/lib/auth/backend-client";

export async function proxyToBackend<T>(fn: () => Promise<T>): Promise<NextResponse> {
  try {
    const data = await fn();
    return NextResponse.json(data ?? {});
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
