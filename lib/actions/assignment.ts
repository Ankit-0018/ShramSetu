import { apiFetch } from "@/lib/api/client";

export async function completeAssignment(assignmentId: string) {
  const res = await apiFetch<{ success: boolean; message: string; data: any }>(
    `/api/v1/jobs/assignments/${assignmentId}/status`,
    { method: "PATCH", body: { status: "COMPLETED" } },
  );

  return res.data;
}

export async function cancelAssignment(assignmentId: string) {
  const res = await apiFetch<{ success: boolean; message: string; data: any }>(
    `/api/v1/jobs/assignments/${assignmentId}/status`,
    { method: "PATCH", body: { status: "CANCELLED" } },
  );

  return res.data;
}

export async function rateAssignment(
  assignmentId: string,
  rating: number,
  comment?: string,
) {
  const res = await apiFetch<{ success: boolean; message: string; data: any }>(
    `/api/v1/jobs/assignments/${assignmentId}/rating`,
    { method: "PATCH", body: { rating, comment } },
  );

  return res.data;
}
