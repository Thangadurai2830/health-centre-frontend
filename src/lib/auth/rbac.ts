import type { UserRole } from "@/lib/auth/types";

const MASTER_DATA_MANAGER_ROLES: readonly UserRole[] = ["district_admin", "super_admin"];

export function canManageMasterData(role: UserRole): boolean {
  return MASTER_DATA_MANAGER_ROLES.includes(role);
}
