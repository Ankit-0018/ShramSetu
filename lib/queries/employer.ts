import { apiFetch } from "@/lib/api/client";

export const getEmployerProfile = async (userId: string) => {
  const res = await apiFetch<{ success: boolean; user: any }>(
    `/api/v1/users/${userId}`,
  );

  return res.user;
};
