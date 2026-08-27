"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EmployerNav } from "@/components/navigation/EmployerNav";
import { Button } from "@/components/ui/button";
import { Assignment } from "@/lib/types/job";
import { completeAssignment, cancelAssignment } from "@/lib/actions/assignment";
import {
  ChevronLeft,
  CheckCircle2,
  XCircle,
  ClipboardList,
  User,
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

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
      case "PENDING":
        return "bg-green-50 text-green-600 border-green-100";
      case "COMPLETED":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "CANCELLED":
        return "bg-orange-50 text-orange-600 border-orange-100";
      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
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

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-blue-600 text-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/employer/home">
            <ChevronLeft className="w-6 h-6 cursor-pointer" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">काम प्रबंधन</h1>
            <p className="text-sm text-blue-100">Manage Assignments</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4 pt-4">
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          <button
            onClick={() => setActiveTab("active")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "active"
                ? "bg-white text-green-600 shadow-sm"
                : "text-gray-500"
            }`}
          >
            सक्रिय / Active ({active.length})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "completed"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500"
            }`}
          >
            पूरा / Done ({completed.length})
          </button>
          <button
            onClick={() => setActiveTab("cancelled")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "cancelled"
                ? "bg-white text-orange-600 shadow-sm"
                : "text-gray-500"
            }`}
          >
            रद्द / Cancelled ({cancelled.length})
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 space-y-4">
        {filteredAssignments.length > 0 ? (
          filteredAssignments.map((assign) => (
            <div
              key={assign.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      Worker: {assign.worker?.user.fullName || assign.workerId}
                    </p>
                    <p className="text-xs text-gray-500">
                      Job: {assign.job?.title || assign.jobId}
                    </p>
                    <p className="text-xs text-gray-400">
                      Assigned:{" "}
                      {assign.createdAt
                        ? new Date(assign.createdAt).toLocaleDateString()
                        : "Recently"}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded-full border ${getStatusStyle(assign.status)}`}
                >
                  {assign.status.toUpperCase()}
                </span>
              </div>

              {/* Actions for active assignments */}
              {(assign.status === "IN_PROGRESS" || assign.status === "PENDING") && (
                <div className="flex gap-3">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700 h-10 text-sm"
                    onClick={() => handleComplete(assign.id)}
                    disabled={processingId === assign.id}
                  >
                    {processingId === assign.id ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                    )}
                    पूर्ण / Complete
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-orange-200 text-orange-600 hover:bg-orange-50 h-10 text-sm"
                    onClick={() => handleCancel(assign.id)}
                    disabled={processingId === assign.id}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    रद्द / Cancel
                  </Button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <div className="mb-4 bg-white p-4 rounded-2xl shadow-sm">
              <ClipboardList className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              कोई काम नहीं / No Assignments
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
