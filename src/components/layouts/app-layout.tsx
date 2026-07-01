import { redirect } from "next/navigation";

import { AppHeader } from "@/components/layouts/app-header";
import { Sidebar } from "@/components/layouts/sidebar";
import { BackendApiError, backendFetch } from "@/lib/auth/backend-client";
import { LOGIN_PATH } from "@/lib/auth/constants";
import { verifySession } from "@/lib/auth/session";
import type { UserProfile } from "@/lib/auth/types";

export async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await verifySession();

  let user: UserProfile;
  try {
    user = await backendFetch<UserProfile>("/api/v1/auth/me", {
      accessToken: session.accessToken,
    });
  } catch (error) {
    if (error instanceof BackendApiError && error.status === 401) {
      redirect(LOGIN_PATH);
    }
    throw error;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <AppHeader user={user} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
