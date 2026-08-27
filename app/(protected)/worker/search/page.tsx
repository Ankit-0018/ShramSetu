"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { WorkerNav } from "@/components/navigation/WorkerNav";
import { InfiniteJobsList } from "@/components/jobs/InfiniteJobsList";
import { Search as SearchIcon } from "lucide-react";

import "@/styles/worker.css";

export default function WorkerSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="worker-container">
      <div className="worker-layout">

        {/* Header */}
        <div className="worker-header">
          <div className="worker-header-content">
            <h1 className="worker-header-title">Jobs</h1>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-3 bg-card border-b border-border sticky top-14 z-30">
          <div className="flex gap-2">

            <div className="flex-1 relative">
              <SearchIcon className="w-4 h-4 absolute left-3 top-3.5 text-muted-foreground" />

              <Input
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

          </div>
        </div>

        {/* Jobs List */}
        <div className="px-4 py-6">
          {/* TODO: the backend's /api/v1/jobs endpoint doesn't support search
              or filter query params yet, so filtering is done client-side
              over the currently loaded page of jobs. */}
          <InfiniteJobsList searchQuery={searchQuery} />
        </div>

      </div>

      {/* Bottom Navigation */}
      <WorkerNav />
    </div>
  );
}
