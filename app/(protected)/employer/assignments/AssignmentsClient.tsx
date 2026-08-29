"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EmployerNav, EmployerNavLinks } from "@/components/navigation/EmployerNav";
import { Button } from "@/components/ui/button";
import { PillTabs } from "@/components/ui/pill-tabs";
import { Assignment } from "@/lib/types/job";
import { completeAssignment, cancelAssignment } from "@/lib/actions/assignment";
import {
  ChevronLeft,
  CheckCircle2,
  XCircle,
  ClipboardList,
  Loader2,
} from "lucide-react";
import { getEmployerAssignments } from "@/lib/queries/assignments";
import { useUserStore } from "@/lib/stores/useUserStore";
import Spinner from "@/components/_shared/spinner";

type Tab = "active" | "completed" | "cancelled";

export default function AssignmentsClient() {
  const [activeTab, setActiveTab] = useState<Tab>("active");
  const router = useRouter();
  const { user } = useUserStore();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState<boolean>(true);
  const active = assignments.filter((a) => a.status === "IN_PROGRESS" || a.status === "PENDING");
  const completed = assignments.filter((a) => a.status === "COMPLETED");
  const cancelled = assignments.filter((a) => a.status === "CANCELLED");

  const filteredAssignments =
    activeTab === "active"
      ? active
      : activeTab === "completed"
        ? completed
        : cancelled;

  const handleComplete = async (assignmentId: string) => {
    if (
      !confirm(
        "काम पूरा हो गया? वर्कर को भुगतान किया जाएगा। / Mark as complete? Worker will be paid."
      )
    )
      return;

    try {
      setProcessingId(assignmentId);
      await completeAssignment(assignmentId);
      startTransition(() => {
        router.refresh();
      });
    } catch (error: any) {
      alert(error.message || "Failed to complete assignment");
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancel = async (assignmentId: string) => {
    if (!confirm("क्या आप इस काम को रद्द करना चाहते हैं? / Cancel this assignment?"))
      return;

    try {
      setProcessingId(assignmentId);
      await cancelAssignment(assignmentId);
      startTransition(() => {
        router.refresh();
      });
    } catch (error: any) {
      alert(error.message || "Failed to cancel assignment");
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    if (!user) return;
    getEmployerAssignments(1, 50).then((res) => {
      setAssignments(res.assignments);
      setLoading(false);
    });
  }, [user]);

  if (loading) {
    return <Spinner />;
  }

  const initials = (name?: string) =>
    (name || "?")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("");

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/employer/home">
            <ChevronLeft className="w-6 h-6 cursor-pointer text-foreground" />
          </Link>
          <h1 className="flex-1 text-xl font-bold text-foreground">Active work</h1>
          <EmployerNavLinks />
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <PillTabs
          className="mb-6"
          items={[
            { key: "active", label: "Active", count: active.length },
            { key: "completed", label: "Done", count: completed.length },
            { key: "cancelled", label: "Cancelled", count: cancelled.length },
          ]}
          active={activeTab}
          onChange={(key) => setActiveTab(key as Tab)}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {filteredAssignments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredAssignments.map((assign) => (
            <div
              key={assign.id}
              className="rounded-2xl border border-border p-5"
            >
              <div className="flex items-start justify-between mb-4 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <span className="text-sm font-semibold text-foreground">
                      {initials(assign.worker?.user.fullName)}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">
                      {assign.worker?.user.fullName || assign.workerId}
                    </p>
                    <p className="text-xs text-gray-500">
                      {assign.job?.title || assign.jobId} · since{" "}
                      {assign.createdAt
                        ? new Date(assign.createdAt).toLocaleDateString()
                        : "Recently"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions for active assignments */}
              {(assign.status === "IN_PROGRESS" || assign.status === "PENDING") && (
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-primary text-primary hover:bg-accent"
                    onClick={() => handleComplete(assign.id)}
                    disabled={processingId === assign.id}
                  >
                    {processingId === assign.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    Mark done
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-destructive/40 text-destructive hover:bg-destructive/10"
                    onClick={() => handleCancel(assign.id)}
                    disabled={processingId === assign.id}
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel
                  </Button>
                </div>
              )}

              {/* Completed state */}
              {assign.status === "COMPLETED" && (
                <div className="flex items-center gap-2 text-sm text-primary font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  Wages paid ·{" "}
                  {assign.updatedAt
                    ? new Date(assign.updatedAt).toLocaleDateString()
                    : new Date(assign.createdAt).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-secondary rounded-2xl">
            <div className="mb-4 bg-white p-4 rounded-2xl shadow-sm">
              <ClipboardList className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              No assignments
            </h3>
            <p className="text-sm text-gray-500">
              {activeTab === "active"
                ? "No active assignments"
                : activeTab === "completed"
                  ? "No completed assignments"
                  : "No cancelled assignments"}
            </p>
          </div>
        )}
      </div>

      <EmployerNav />
    </div>
  );
}
