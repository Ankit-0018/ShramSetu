import { apiFetch } from "@/lib/api/client";
import { Application, Assignment } from "@/lib/types/job";

type ApplicationStatusResponse = {
  success: boolean;
  message: string;
  data: { application: Application; assignment?: Assignment };
};

export async function acceptApplication(applicationId: string) {
  const res = await apiFetch<ApplicationStatusResponse>(
    `/api/v1/jobs/applications/${applicationId}/status`,
    { method: "PATCH", body: { status: "ACCEPTED" } },
  );

  return res.data;
}

export async function rejectApplication(applicationId: string) {
  const res = await apiFetch<ApplicationStatusResponse>(
    `/api/v1/jobs/applications/${applicationId}/status`,
    { method: "PATCH", body: { status: "REJECTED" } },
  );

  return res.data;
}
