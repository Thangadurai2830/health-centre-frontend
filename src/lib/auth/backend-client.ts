import "server-only";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export class BackendApiError extends Error {
  constructor(
    public status: number,
    public errorCode: string,
    message: string,
  ) {
    super(message);
  }
}

function extractErrorMessage(message: unknown): string {
  if (typeof message === "string") return message;
  if (Array.isArray(message)) {
    const first = message[0];
    if (typeof first?.msg === "string") return first.msg;
  }
  return "Request failed";
}

export async function backendFetch<T>(
  path: string,
  init?: RequestInit & { accessToken?: string },
): Promise<T> {
  const { accessToken, headers, ...rest } = init ?? {};

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    cache: "no-store",
  });

  const isNoContent = response.status === 204;
  const body = isNoContent ? null : await response.json().catch(() => null);

  if (!response.ok) {
    const errorCode = (body?.error_code as string) ?? "unknown_error";
    const message = extractErrorMessage(body?.message);
    throw new BackendApiError(response.status, errorCode, message);
  }

  return body as T;
}
