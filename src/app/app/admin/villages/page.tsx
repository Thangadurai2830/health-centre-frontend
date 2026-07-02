import { verifySession } from "@/lib/auth/session";
import { VillagesClient } from "@/app/app/admin/villages/villages-client";

export default async function VillagesPage() {
  const session = await verifySession();
  return <VillagesClient role={session.claims.role} />;
}
