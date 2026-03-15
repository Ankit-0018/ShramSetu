"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WorkerNav } from "@/components/navigation/WorkerNav";
import { InfiniteJobsList } from "@/components/jobs/InfiniteJobsList";
import { useJobStore } from "@/lib/stores/useJobStore";
import { Search as SearchIcon, Filter } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import "@/styles/worker.css";

export default function WorkerSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const setFilters = useJobStore((s) => s.setFilters);

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

            <Button
              variant="outline"
              size="icon"
              onClick={() => setFilterOpen(true)}
            >
              <Filter className="w-4 h-4" />
            </Button>

          </div>
        </div>

        {/* FILTER MODAL */}

        <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
          <DialogContent className="max-w-md">

            <DialogHeader>
              <DialogTitle>Filter Jobs</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">

              {/* Advance Pay */}
              <div className="flex items-center justify-between">
                <Label>Advance Pay</Label>

                <Checkbox
                  onCheckedChange={(checked) =>
                    setFilters({ advancePay: checked === true })
                  }
                />
              </div>

              {/* High Pay */}
              <div className="flex items-center justify-between">
                <Label>₹800+ Pay</Label>

                <Checkbox
                  onCheckedChange={(checked) =>
                    checked
                      ? setFilters({ minWage: 800 })
                      : setFilters({ minWage: undefined })
                  }
                />
              </div>

              {/* Skill */}
              <div className="space-y-2">
                <Label>Skill</Label>

                <select
                  className="w-full border rounded-md p-2"
                  onChange={(e) =>
                    setFilters({ skill: e.target.value })
                  }
                >
                  <option value="">All</option>
                  <option value="plumber">Plumber</option>
                  <option value="electrician">Electrician</option>
                  <option value="mason">Mason</option>
                </select>
              </div>

            </div>

            <DialogFooter>

              <Button
                variant="outline"
                onClick={() => setFilters({})}
              >
                Reset
              </Button>

              <Button onClick={() => setFilterOpen(false)}>
                Apply Filters
              </Button>

            </DialogFooter>

          </DialogContent>
        </Dialog>

        {/* Jobs List */}
        <div className="px-4 py-6">
          <InfiniteJobsList searchQuery={searchQuery} />
        </div>

      </div>

      {/* Bottom Navigation */}
      <WorkerNav />
    </div>
  );
}