import { verifySession } from "@/lib/auth/session";
import { SpecializationsClient } from "@/app/app/admin/specializations/specializations-client";

export default async function SpecializationsPage() {
  const session = await verifySession();
  return <SpecializationsClient role={session.claims.role} />;
}
