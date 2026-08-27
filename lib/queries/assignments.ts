import { apiFetch } from "@/lib/api/client";
import { Assignment, Pagination } from "../types/job";

/**
 * Get all assignments across the current employer's jobs
 */
export const getEmployerAssignments = async (
  page: number = 1,
  limit: number = 10,
) => {
  const res = await apiFetch<{
    success: boolean;
    data: { assignments: Assignment[]; pagination: Pagination };
  }>(`/api/v1/employers/assignments?page=${page}&limit=${limit}`);

  return res.data;
};

/**
 * Get all assignments for the current worker
 */
export const getMyAssignedJobs = async (page: number = 1, limit: number = 10) => {
  const res = await apiFetch<{
    success: boolean;
    data: { assignments: Assignment[]; pagination: Pagination };
  }>(`/api/v1/workers/assignments?page=${page}&limit=${limit}`);

  return res.data;
};
