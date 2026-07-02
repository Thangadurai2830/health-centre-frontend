import { verifySession } from "@/lib/auth/session";
import { DistrictsClient } from "@/app/app/admin/districts/districts-client";

export default async function DistrictsPage() {
  const session = await verifySession();
  return <DistrictsClient role={session.claims.role} />;
}
