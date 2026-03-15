import { create } from "zustand";
import { Job } from "../types";
import { getPaginatedJobs } from "../queries/jobs";
import { JobFilters } from "../types/job";

interface JobState {
  jobs: Job[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  lastVisibleId: string | null;
  error: string | null;

  filters: JobFilters;

  setFilters: (filters: Partial<JobFilters>) => void;

  fetchJobs: (limit?: number) => Promise<void>;
  fetchMoreJobs: (limit?: number) => Promise<void>;
  reset: () => void;
}

export const useJobStore = create<JobState>()((set, get) => ({
  jobs: [],
  loading: false,
  loadingMore: false,
  hasMore: true,
  lastVisibleId: null,
  error: null,

  filters: {},
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      jobs: [],
      lastVisibleId: null,
      hasMore: true,
    })),

  fetchJobs: async (limitSize = 10) => {
    console.log("inside fetching jobs..");

    const { filters } = get();
    set({ loading: true, error: null });
    try {
      const response = await getPaginatedJobs(limitSize, undefined, filters);
      console.log("This is the response...", response);
      set({
        jobs: response.jobs,
        lastVisibleId: response.lastVisibleId,
        hasMore: response.hasMore,
        loading: false,
      });
    } catch (error) {
      set({ error: "Failed to fetch jobs", loading: false });
    }
  },
  fetchMoreJobs: async (limitSize = 10) => {
    const { hasMore, lastVisibleId, loadingMore, jobs, filters } = get();
    if (!hasMore || !lastVisibleId || loadingMore) return;

    set({ loadingMore: true });
    try {
      const response = await getPaginatedJobs(
        limitSize,
        lastVisibleId,
        filters,
      );
      set({
        jobs: [...jobs, ...response.jobs],
        lastVisibleId: response.lastVisibleId,
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
      lastVisibleId: null,
      error: null,
    });
  },
}));
