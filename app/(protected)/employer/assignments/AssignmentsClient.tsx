"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EmployerNav } from "@/components/navigation/EmployerNav";
import { Button } from "@/components/ui/button";
import { Assignment } from "@/lib/types";
import { completeAssignment, disputeAssignment } from "@/lib/actions/assignment";
import {
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ClipboardList,
  User,
  Loader2,
} from "lucide-react";
import { getEmployerAssignments } from "@/lib/queries/assignments";
import { useUserStore } from "@/lib/stores/useUserStore";
import Spinner from "@/components/_shared/spinner";

type Tab = "active" | "completed" | "disputed";

export default function AssignmentsClient() {
  const [activeTab, setActiveTab] = useState<Tab>("active");
  const router = useRouter();
  const {user} = useUserStore();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [showDisputeModal, setShowDisputeModal] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [disputeReason, setDisputeReason] = useState("");
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState<boolean>(true);
  const active = assignments.filter((a) => a.status === "active");
  const completed = assignments.filter((a) => a.status === "completed");
  const disputed = assignments.filter((a) => a.status === "disputed");

  const filteredAssignments =
    activeTab === "active"
      ? active
      : activeTab === "completed"
        ? completed
        : disputed;

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

  const handleDispute = async (assignmentId: string) => {
    if (!disputeReason.trim()) {
      alert("कृपया विवाद का कारण बताएं / Please provide a reason");
      return;
    }

    try {
      setProcessingId(assignmentId);
      await disputeAssignment(assignmentId, disputeReason);
      setShowDisputeModal(null);
      setDisputeReason("");
      startTransition(() => {
        router.refresh();
      });
    } catch (error: any) {
      alert(error.message || "Failed to dispute assignment");
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-600 border-green-100";
      case "completed":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "disputed":
        return "bg-orange-50 text-orange-600 border-orange-100";
      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };
  useEffect(() => {

    if(!user?.uid) return;
  getEmployerAssignments(user.uid).then((res) => {
    setAssignments(res);
    setLoading(false)
  });
  },[user])


    if (loading) {
      return <Spinner />
    }
      if (!assignments) {
      return <div className="p-6">No assignments data found</div>;
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
            onClick={() => setActiveTab("disputed")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "disputed"
                ? "bg-white text-orange-600 shadow-sm"
                : "text-gray-500"
            }`}
          >
            विवाद / Disputed ({disputed.length})
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
                      Worker: {assign.workerId}
                    </p>
                    <p className="text-xs text-gray-500">
                      Job: {assign.jobId}
                    </p>
                    <p className="text-xs text-gray-400">
                      Assigned:{" "}
                      {assign.assignedAt
                        ? new Date(assign.assignedAt).toLocaleDateString()
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

              {/* Dispute reason if disputed */}
              {assign.status === "disputed" && assign.disputeReason && (
                <div className="bg-orange-50 rounded-lg p-3 mb-4 text-sm text-orange-800">
                  <p className="font-medium text-xs mb-1">Dispute Reason:</p>
                  <p className="text-xs">{assign.disputeReason}</p>
                </div>
              )}

              {/* Completed info */}
              {assign.status === "completed" && assign.completedAt && (
                <div className="bg-green-50 rounded-lg p-3 mb-4 text-sm text-green-800">
                  <p className="text-xs">
                    Completed on:{" "}
                    {new Date(assign.completedAt).toLocaleDateString()}
                  </p>
                </div>
              )}

              {/* Actions for active assignments */}
              {assign.status === "active" && (
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
                    onClick={() => setShowDisputeModal(assign.id)}
                    disabled={processingId === assign.id}
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    विवाद / Dispute
                  </Button>
                </div>
              )}

              {/* Dispute Modal */}
              {showDisputeModal === assign.id && (
                <div className="mt-4 bg-orange-50 rounded-xl p-4 border border-orange-200">
                  <h4 className="font-semibold text-sm mb-2">
                    विवाद का कारण / Dispute Reason
                  </h4>
                  <textarea
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    placeholder="कृपया कारण बताएं / Please provide a reason..."
                    className="w-full border rounded-lg px-3 py-2 text-sm mb-3"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-orange-600 hover:bg-orange-700 h-9 text-sm"
                      onClick={() => handleDispute(assign.id)}
                      disabled={processingId === assign.id}
                    >
                      {processingId === assign.id ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : null}
                      Submit Dispute
                    </Button>
                    <Button
                      variant="outline"
                      className="h-9 text-sm"
                      onClick={() => {
                        setShowDisputeModal(null);
                        setDisputeReason("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
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
                  : "No disputed assignments"}
            </p>
          </div>
        )}
      </div>

      <EmployerNav />
    </div>
  );
}
