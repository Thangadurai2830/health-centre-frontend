"use client";

import type { ApiErrorBody, UserProfile } from "@/lib/auth/types";

export class AuthClientError extends Error {
  constructor(
    public errorCode: string,
    message: string,
  ) {
    super(message);
  }
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    const errorBody = data as ApiErrorBody | null;
    const message =
      typeof errorBody?.message === "string" ? errorBody.message : "Something went wrong";
    throw new AuthClientError(errorBody?.error_code ?? "unknown_error", message);
  }

  return data as T;
}

export function sendOtp(input: { mobile_number: string; country_code: string }) {
  return postJson<{
    message: string;
    mobile_number: string;
    expires_in_seconds: number;
    resend_allowed_in_seconds: number;
  }>("/api/auth/send-otp", input);
}

export function verifyOtp(input: {
  mobile_number: string;
  country_code: string;
  otp_code: string;
}) {
  return postJson<{ is_new_user: boolean; user: UserProfile }>("/api/auth/verify-otp", input);
}

export function logout() {
  return postJson<{ ok: true }>("/api/auth/logout", {});
}

export function logoutAll() {
  return postJson<{ ok: true }>("/api/auth/logout-all", {});
}

export async function fetchMe(): Promise<UserProfile> {
  const response = await fetch("/api/auth/me");
  const data = await response.json();
  if (!response.ok) {
    throw new AuthClientError(data?.error_code ?? "unknown_error", data?.message ?? "Failed");
  }
  return data as UserProfile;
}
