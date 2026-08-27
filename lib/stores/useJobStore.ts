import { create } from "zustand";
import { NearbyJob } from "../types/job";
import { getPaginatedJobs } from "../queries/jobs";

interface JobState {
  jobs: NearbyJob[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  page: number;
  error: string | null;

  fetchJobs: (limit?: number) => Promise<void>;
  fetchMoreJobs: (limit?: number) => Promise<void>;
  reset: () => void;
}

export const useJobStore = create<JobState>()((set, get) => ({
  jobs: [],
  loading: false,
  loadingMore: false,
  hasMore: true,
  page: 1,
  error: null,

  fetchJobs: async (limit = 10) => {
    set({ loading: true, error: null });
    try {
      const response = await getPaginatedJobs(1, limit);
      set({
        jobs: response.jobs,
        page: 1,
        hasMore: response.hasMore,
        loading: false,
      });
    } catch (error) {
      set({ error: "Failed to fetch jobs", loading: false });
    }
  },
  fetchMoreJobs: async (limit = 10) => {
    const { hasMore, loadingMore, jobs, page } = get();
    if (!hasMore || loadingMore) return;

    set({ loadingMore: true });
    try {
      const nextPage = page + 1;
      const response = await getPaginatedJobs(nextPage, limit);
      set({
        jobs: [...jobs, ...response.jobs],
        page: nextPage,
        hasMore: response.hasMore,
        loadingMore: false,
      });
    } catch (error) {
      set({ error: "Failed to fetch more jobs", loadingMore: false });
    }
  },

  reset: () => {
    set({
      jobs: [],
      loading: false,
      loadingMore: false,
      hasMore: true,
      page: 1,
      error: null,
    });
  },
}));
