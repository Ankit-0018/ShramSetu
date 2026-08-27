import { apiFetch } from "@/lib/api/client";
import { Assignment } from "@/lib/types/job";

type AssignmentStatusResponse = {
  success: boolean;
  message: string;
  data: Assignment;
};

type RatingResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    assignmentId: string;
    workerId: string;
    employerId: string;
    rating: number;
    comment?: string | null;
  };
};

export async function completeAssignment(assignmentId: string) {
  const res = await apiFetch<AssignmentStatusResponse>(
    `/api/v1/jobs/assignments/${assignmentId}/status`,
    { method: "PATCH", body: { status: "COMPLETED" } },
  );

  return res.data;
}

export async function cancelAssignment(assignmentId: string) {
  const res = await apiFetch<AssignmentStatusResponse>(
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
  const res = await apiFetch<RatingResponse>(
    `/api/v1/jobs/assignments/${assignmentId}/rating`,
    { method: "PATCH", body: { rating, comment } },
  );

  return res.data;
}
