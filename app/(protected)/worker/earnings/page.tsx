"use client";

import { useState, useEffect } from "react";
import { WorkerNav } from "@/components/navigation/WorkerNav";
import { WorkerHeader } from "@/components/worker/worker-header";
import "@/styles/worker.css";
import { useUserStore } from "@/lib/stores/useUserStore";
import { getMyAssignedJobs } from "@/lib/queries/assignments";
import { Assignment } from "@/lib/types/job";
import Spinner from "@/components/_shared/spinner";
import { Badge } from "@/components/ui/badge";

// TODO: the backend's assignment list endpoints don't return a wage/earnings
// amount per assignment, so we can no longer compute earnings totals
// client-side without fetching each job's minimumWage individually. This page
// is simplified to show assignment counts by status instead of a dollar
// total until the backend exposes that data.
export default function WorkerEarningsPage() {
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const { user } = useUserStore();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const res = await getMyAssignedJobs(1, 50);
        setAssignments(res.assignments);
      } catch (error) {
        console.error("Error fetching assignments data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <Spinner />;
  }

  const completedAssignments = assignments.filter((a) => a.status === "COMPLETED");
  const activeAssignments = assignments.filter((a) => a.status === "IN_PROGRESS");
  const pendingAssignments = assignments.filter((a) => a.status === "PENDING");

  const getStatusVariant = (
    status: string,
  ): "warning" | "success" | "danger" | "outline" | "default" => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "IN_PROGRESS":
        return "success";
      case "COMPLETED":
        return "outline";
      case "CANCELLED":
        return "danger";
      default:
        return "default";
    }
  };

  return (
    <div className="worker-container">
      <div className="worker-layout">
        <WorkerHeader title="My Earnings" />

        {/* Scroll Content */}
        <div className="px-4 py-6 pb-32 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-foreground">My earnings</h1>
            <p className="text-sm text-muted-foreground mt-1">
              All time
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 divide-x divide-border border-y border-border py-4">
            <div className="text-center">
              <p className="text-xl font-bold text-foreground">
                {pendingAssignments.length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Waiting</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-foreground">
                {activeAssignments.length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Active</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-foreground">
                {completedAssignments.length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Done</p>
            </div>
          </div>

          {/* Work log */}
          <div>
            <h3 className="font-bold text-foreground mb-2">Work log</h3>
            {assignments.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {assignments.slice(0, 10).map((assign) => (
                  <div
                    key={assign.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-foreground truncate">
                        {assign.job?.title || "Assignment"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {assign.job?.location?.formattedAddress}
                        {assign.job?.location?.formattedAddress && " · "}
                        {assign.createdAt
                          ? new Date(assign.createdAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                    <Badge variant={getStatusVariant(assign.status)}>
                      {assign.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No assignments yet
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <WorkerNav />
    </div>
  );
}
