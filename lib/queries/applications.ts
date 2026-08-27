import { apiFetch } from "@/lib/api/client";
import { Application, Pagination } from "../types/job";

/**
 * Get all applications for a specific job (employer view)
 */
export const getApplicationsForJob = async (
  jobId: string,
  page: number = 1,
  limit: number = 10,
) => {
  const res = await apiFetch<{
    success: boolean;
    data: { applications: Application[]; pagination: Pagination };
  }>(`/api/v1/jobs/${jobId}/applications?page=${page}&limit=${limit}`);

  return res.data;
};

/**
 * Get all applications submitted by the current worker
 */
export const getMyApplications = async (page: number = 1, limit: number = 10) => {
  const res = await apiFetch<{
    success: boolean;
    data: { applications: Application[]; pagination: Pagination };
  }>(`/api/v1/workers/applications?page=${page}&limit=${limit}`);

  return res.data;
};

/**
 * Get all applications across the current employer's jobs
 */
export const getEmployerApplications = async (
  page: number = 1,
  limit: number = 10,
) => {
  const res = await apiFetch<{
    success: boolean;
    data: { applications: Application[]; pagination: Pagination };
  }>(`/api/v1/employers/applications?page=${page}&limit=${limit}`);

  return res.data;
};
