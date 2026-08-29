"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { WorkerNav } from "@/components/navigation/WorkerNav";
import { WorkerHeader } from "@/components/worker/worker-header";
import { InfiniteJobsList } from "@/components/jobs/InfiniteJobsList";
import { Search as SearchIcon } from "lucide-react";

import "@/styles/worker.css";

export default function WorkerSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="worker-container">
      <div className="worker-layout">

        {/* Header */}
        <WorkerHeader title="Find work" />

        {/* Search Bar */}
        <div className="px-4 py-3 bg-card border-b border-border sticky top-14 z-30">
          <div className="relative">
            <SearchIcon className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />

            <Input
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11"
            />
          </div>
        </div>

        {/* Jobs List */}
        <div className="px-4 py-6 pb-32">
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
