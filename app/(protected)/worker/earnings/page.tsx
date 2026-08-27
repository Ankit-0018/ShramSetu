"use client";

import { useState, useEffect } from "react";
import { WorkerNav } from "@/components/navigation/WorkerNav";
import "@/styles/worker.css";
import { CheckCircle2, Clock, ClipboardList } from "lucide-react";
import { useUserStore } from "@/lib/stores/useUserStore";
import { getMyAssignedJobs } from "@/lib/queries/assignments";
import { Assignment } from "@/lib/types/job";
import Spinner from "@/components/_shared/spinner";

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

  return (
    <div className="worker-container">
      <div className="worker-layout">
        {/* Header */}
        <div className="worker-header">
          <div className="worker-header-content">
            <h1 className="worker-header-title">My Work</h1>
          </div>
        </div>

        {/* Scroll Content */}
        <div className="px-4 py-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card rounded-lg p-4 shadow-sm text-center">
              <Clock className="w-5 h-5 mx-auto mb-2 text-amber-600" />
              <p className="text-xl font-bold text-amber-600">
                {pendingAssignments.length}
              </p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
            <div className="bg-card rounded-lg p-4 shadow-sm text-center">
              <ClipboardList className="w-5 h-5 mx-auto mb-2 text-blue-600" />
              <p className="text-xl font-bold text-blue-600">
                {activeAssignments.length}
              </p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </div>
            <div className="bg-card rounded-lg p-4 shadow-sm text-center">
              <CheckCircle2 className="w-5 h-5 mx-auto mb-2 text-green-600" />
              <p className="text-xl font-bold text-green-600">
                {completedAssignments.length}
              </p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </div>

          {/* Recent Assignments */}
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold mb-4">Recent Assignments</h3>
            {assignments.length > 0 ? (
              <div className="space-y-3">
                {assignments.slice(0, 10).map((assign) => (
                  <div
                    key={assign.id}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="font-medium text-sm">
                        {assign.job?.title || "Assignment"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {assign.createdAt
                          ? new Date(assign.createdAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                    <p className="text-xs font-semibold text-primary">
                      {assign.status}
                    </p>
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
