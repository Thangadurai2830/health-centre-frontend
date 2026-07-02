"use client";

import type { ApiErrorBody } from "@/lib/auth/types";

export class AdminApiError extends Error {
  constructor(
    public errorCode: string,
    message: string,
  ) {
    super(message);
  }
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const data = response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    const errorBody = data as ApiErrorBody | null;
    const message =
      typeof errorBody?.message === "string" ? errorBody.message : "Something went wrong";
    throw new AdminApiError(errorBody?.error_code ?? "unknown_error", message);
  }

  return data as T;
}

export async function adminGet<T>(path: string, params?: Record<string, string | undefined>): Promise<T> {
  const query = params
    ? Object.entries(params)
        .filter(([, value]) => value !== undefined && value !== "")
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`)
        .join("&")
    : "";
  const url = query ? `${path}?${query}` : path;
  const response = await fetch(url);
  return parseResponse<T>(response);
}

export async function adminMutate<T>(
  path: string,
  method: "POST" | "PUT" | "DELETE",
  body?: unknown,
): Promise<T> {
  const response = await fetch(path, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  return parseResponse<T>(response);
}
