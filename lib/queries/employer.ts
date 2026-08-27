import { apiFetch } from "@/lib/api/client";
import type { UserRole, WorkerProfile, EmployerProfile } from "@/lib/stores/useUserStore";

export type PublicProfile = {
  id: string;
  fullName: string;
  role: UserRole | null;
  workerProfile: WorkerProfile | null;
  employerProfile: EmployerProfile | null;
};

export const getEmployerProfile = async (userId: string) => {
  const res = await apiFetch<{ success: boolean; user: PublicProfile }>(
    `/api/v1/users/${userId}`,
  );

  return res.user;
};
