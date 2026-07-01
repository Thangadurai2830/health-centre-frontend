import { Wrench } from "lucide-react";

import { APP_NAME } from "@/lib/constants";

export const metadata = {
  title: "Under maintenance",
};

export default function MaintenancePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <Wrench className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          {APP_NAME} is undergoing maintenance
        </h1>
        <p className="max-w-md text-muted-foreground">
          We&rsquo;re making scheduled improvements. Please check back shortly.
        </p>
      </div>
    </div>
  );
}
