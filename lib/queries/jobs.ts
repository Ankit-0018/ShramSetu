import { apiFetch, ApiError } from "@/lib/api/client";
import { EmployerJob, JobDetail, NearbyJob, Pagination } from "../types/job";

const EMPTY_JOBS_PAGE = (page: number, limit: number) => ({
  jobs: [] as NearbyJob[],
  pagination: { total: 0, page, limit, totalPages: 1 },
  hasMore: false,
});

export async function getPaginatedJobs(page: number = 1, limit: number = 10) {
  try {
    const res = await apiFetch<{
      success: boolean;
      data: { jobs: NearbyJob[]; pagination: Pagination };
    }>(`/api/v1/jobs?page=${page}&limit=${limit}`);

    return {
      jobs: res.data.jobs,
      pagination: res.data.pagination,
      hasMore: res.data.pagination.page < res.data.pagination.totalPages,
    };
  } catch (error) {
    // Worker hasn't shared their location yet — expected state for a
    // fresh/opted-out worker, not a real error. Just show no nearby jobs.
    if (error instanceof ApiError && error.status === 400) {
      return EMPTY_JOBS_PAGE(page, limit);
    }
    console.error("Error fetching paginated jobs:", error);
    return EMPTY_JOBS_PAGE(page, limit);
  }
}

export async function getJobById(id: string): Promise<JobDetail | null> {
  try {
    const res = await apiFetch<{ success: boolean; data: JobDetail }>(
      `/api/v1/jobs/${id}`,
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching job by id:", error);
    return null;
  }
}

export const getEmployerJobs = async (page: number = 1, limit: number = 10) => {
  const res = await apiFetch<{
    success: boolean;
    data: { jobs: EmployerJob[]; pagination: Pagination };
  }>(`/api/v1/employers/jobs?page=${page}&limit=${limit}`);

  return res.data;
};
