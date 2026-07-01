import type { Metadata } from "next";
import { Suspense } from "react";
import { Activity } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";

import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Log in",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="mb-2 flex items-center gap-2 font-medium tracking-tight">
            <Activity className="h-5 w-5" aria-hidden="true" />
            <span>{APP_NAME}</span>
          </div>
          <CardTitle>Log in with your mobile number</CardTitle>
          <CardDescription>We&apos;ll send you a one-time code to verify it&apos;s you.</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
