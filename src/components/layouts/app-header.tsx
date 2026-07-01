"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth/client";
import { LOGIN_PATH } from "@/lib/auth/constants";
import type { UserProfile } from "@/lib/auth/types";

export function AppHeader({ user }: { user: UserProfile }) {
  const router = useRouter();

  async function handleLogout() {
    await logout().catch(() => null);
    router.push(LOGIN_PATH);
    router.refresh();
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-border/60 px-6">
      <div className="text-sm text-muted-foreground">
        {user.full_name ?? `${user.country_code} ${user.mobile_number}`}
      </div>
      <Button variant="ghost" size="sm" onClick={handleLogout}>
        <LogOut aria-hidden="true" />
        Log out
      </Button>
    </header>
  );
}
