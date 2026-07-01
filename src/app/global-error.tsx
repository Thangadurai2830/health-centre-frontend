"use client";

import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
          <AlertTriangle className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-tight">Something went wrong</h1>
            <p className="max-w-md text-muted-foreground">
              An unexpected error occurred. Please try again, and contact support if the
              problem persists.
            </p>
            {error.digest ? (
              <p className="text-xs text-muted-foreground">Reference: {error.digest}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="inline-flex h-10 items-center justify-center rounded-md bg-foreground px-6 text-sm font-medium text-background transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
