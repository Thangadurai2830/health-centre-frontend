import { verifySession } from "@/lib/auth/session";
import { DepartmentsClient } from "@/app/app/admin/departments/departments-client";

export default async function DepartmentsPage() {
  const session = await verifySession();
  return <DepartmentsClient role={session.claims.role} />;
}
