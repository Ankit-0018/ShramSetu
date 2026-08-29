"use client";

import { useEffect, useRef, useCallback } from "react";
import { useJobStore } from "@/lib/stores/useJobStore";
import { JobCard } from "./JobCard";
import { Loader2 } from "lucide-react";

interface InfiniteJobsListProps {
  searchQuery?: string;
}

export function InfiniteJobsList({ searchQuery }: InfiniteJobsListProps) {
  const {
    jobs,
    loading,
    loadingMore,
    hasMore,
    fetchJobs,
    fetchMoreJobs,
  } = useJobStore();

  const observer = useRef<IntersectionObserver | null>(null);

  const lastJobElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || loadingMore) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        const first = entries[0];

        if (first.isIntersecting && hasMore && !loadingMore) {
          fetchMoreJobs();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, loadingMore, hasMore, fetchMoreJobs],
  );

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = searchQuery
    ? jobs.filter((job) =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : jobs;

  if (loading && jobs.length === 0) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (filteredJobs.length === 0 && !loading) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔍</div>
        <h3 className="empty-state-title">कोई काम नहीं मिला</h3>
        <p className="empty-state-description">
          अपनी खोज या फिल्टर को समायोजित करने का प्रयास करें
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-2">
        {filteredJobs.length} jobs found
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredJobs.map((job, index) => {
          if (filteredJobs.length === index + 1) {
            return (
              <div ref={lastJobElementRef} key={job.id}>
                <JobCard job={job} />
              </div>
            );
          }
          return <JobCard key={job.id} job={job} />;
        })}
      </div>

      {(loading || loadingMore) && (
        <div className="flex justify-center items-center py-4">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}

      {!hasMore && filteredJobs.length > 0 && (
        <p className="text-center text-xs text-muted-foreground py-4">
          No more jobs to show
        </p>
      )}
    </div>
  );
}
