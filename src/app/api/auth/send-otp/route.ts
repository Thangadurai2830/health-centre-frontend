import { backendFetch } from "@/lib/auth/backend-client";
import { proxyToBackend } from "@/lib/auth/proxy-response";

export async function POST(request: Request) {
  const payload = await request.json();

  return proxyToBackend(() =>
    backendFetch("/api/v1/auth/send-otp", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  );
}
