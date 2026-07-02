import { verifySession } from "@/lib/auth/session";
import { BlocksClient } from "@/app/app/admin/blocks/blocks-client";

export default async function BlocksPage() {
  const session = await verifySession();
  return <BlocksClient role={session.claims.role} />;
}
