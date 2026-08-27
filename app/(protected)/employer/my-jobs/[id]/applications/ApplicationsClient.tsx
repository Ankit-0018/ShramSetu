"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EmployerNav } from "@/components/navigation/EmployerNav";
import { Button } from "@/components/ui/button";
import { JobDetail, Application } from "@/lib/types/job";
import { acceptApplication, rejectApplication } from "@/lib/actions/application";
import {
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Loader2,
} from "lucide-react";

type Props = {
  job: JobDetail;
  applications: Application[];
};

export default function ApplicationsClient({ job, applications }: Props) {
  const router = useRouter();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleAccept = async (applicationId: string) => {
    if (
      !confirm(
        "इस आवेदन को स्वीकार करें? यह नौकरी बंद हो जाएगी। / Accept this application? The job will be closed."
      )
    )
      return;

    try {
      setProcessingId(applicationId);
      await acceptApplication(applicationId);
      startTransition(() => {
        router.refresh();
      });
    } catch (error: any) {
      alert(error.message || "Failed to accept application");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (applicationId: string) => {
    if (
      !confirm("इस आवेदन को अस्वीकार करें? / Reject this application?")
    )
      return;

    try {
      setProcessingId(applicationId);
      await rejectApplication(applicationId);
      startTransition(() => {
        router.refresh();
      });
    } catch (error: any) {
      alert(error.message || "Failed to reject application");
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-50 text-yellow-600 border-yellow-100";
      case "ACCEPTED":
        return "bg-green-50 text-green-600 border-green-100";
      case "REJECTED":
        return "bg-red-50 text-red-600 border-red-100";
      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  const pendingApps = applications.filter((a) => a.status === "PENDING");
  const processedApps = applications.filter((a) => a.status !== "PENDING");

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-blue-600 text-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/employer/my-jobs">
            <ChevronLeft className="w-6 h-6 cursor-pointer" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold truncate">
              आवेदन / Applications
            </h1>
            <p className="text-sm text-blue-100 truncate">{job.title}</p>
          </div>
          <span className="bg-blue-500 px-3 py-1 rounded-full text-xs font-bold flex-shrink-0">
            ₹{job.minimumWage}
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Job Summary */}
        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <h3 className="font-bold text-gray-900 mb-2">{job.title}</h3>
          <p className="text-sm text-gray-600 mb-3">
            {job.description?.substring(0, 120)}
          </p>
          <div className="flex gap-2 flex-wrap">
            <span className="bg-blue-50 text-blue-700 text-[10px] px-2 py-0.5 rounded font-medium">
              {job.primarySkill}
            </span>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            Status:{" "}
            <span
              className={`font-bold ${job.isActive ? "text-green-600" : "text-gray-600"}`}
            >
              {job.isActive ? "OPEN" : "CLOSED"}
            </span>
          </div>
        </div>

        {/* Pending Applications */}
        {pendingApps.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              लंबित आवेदन / Pending ({pendingApps.length})
            </h3>
            <div className="space-y-4">
              {pendingApps.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl p-5 border shadow-sm"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          Worker: {app.worker?.user.fullName || app.workerId}
                        </p>
                        <p className="text-xs text-gray-500">
                          Applied:{" "}
                          {app.createdAt
                            ? new Date(app.createdAt).toLocaleDateString()
                            : "Recently"}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded-full border ${getStatusStyle(app.status)}`}
                    >
                      PENDING
                    </span>
                  </div>

                  {job.isActive && (
                    <div className="flex gap-3">
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700 h-10 text-sm"
                        onClick={() => handleAccept(app.id)}
                        disabled={processingId === app.id}
                      >
                        {processingId === app.id ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                        )}
                        स्वीकार / Accept
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-red-200 text-red-600 hover:bg-red-50 h-10 text-sm"
                        onClick={() => handleReject(app.id)}
                        disabled={processingId === app.id}
                      >
                        {processingId === app.id ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <XCircle className="w-4 h-4 mr-2" />
                        )}
                        अस्वीकार / Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Processed Applications */}
        {processedApps.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              प्रोसेस्ड / Processed
            </h3>
            <div className="space-y-3">
              {processedApps.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-xl p-4 border shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900">
                        Worker: {app.worker?.user.fullName || app.workerId}
                      </p>
                      <p className="text-xs text-gray-500">
                        {app.createdAt
                          ? new Date(app.createdAt).toLocaleDateString()
                          : "Recently"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded-full border ${getStatusStyle(app.status)}`}
                  >
                    {app.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {applications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <div className="mb-4 bg-white p-4 rounded-2xl shadow-sm">
              <User className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              कोई आवेदन नहीं
            </h3>
            <p className="text-sm text-gray-500">
              No applications for this job yet
            </p>
          </div>
        )}
      </div>

      <EmployerNav />
    </div>
  );
}
