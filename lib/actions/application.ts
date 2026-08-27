import { apiFetch } from "@/lib/api/client";

export async function acceptApplication(applicationId: string) {
  const res = await apiFetch<{ success: boolean; message: string; data: any }>(
    `/api/v1/jobs/applications/${applicationId}/status`,
    { method: "PATCH", body: { status: "ACCEPTED" } },
  );

  return res.data;
}

export async function rejectApplication(applicationId: string) {
  const res = await apiFetch<{ success: boolean; message: string; data: any }>(
    `/api/v1/jobs/applications/${applicationId}/status`,
    { method: "PATCH", body: { status: "REJECTED" } },
  );

  return res.data;
}
