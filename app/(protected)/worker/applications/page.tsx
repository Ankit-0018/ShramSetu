"use client";

import { useEffect, useState } from "react";
import { WorkerNav } from "@/components/navigation/WorkerNav";
import { WorkerHeader } from "@/components/worker/worker-header";
import { useUserStore } from "@/lib/stores/useUserStore";
import { getMyApplications } from "@/lib/queries/applications";
import { getMyAssignedJobs } from "@/lib/queries/assignments";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ClipboardList,
} from "lucide-react";
import "@/styles/worker.css";
import Link from "next/link";
import Spinner from "@/components/_shared/spinner";
import { Application, Assignment } from "@/lib/types";

type Tab = "applications" | "assignments";

export default function MyApplicationsPage() {
  const { user } = useUserStore();
  const [activeTab, setActiveTab] = useState<Tab>("applications");
  const [applications, setApplications] = useState<Application[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [appsRes, assignsRes] = await Promise.all([
          getMyApplications(user.uid),
          getMyAssignedJobs(user.uid),
        ]);
        setApplications(appsRes);
        setAssignments(assignsRes);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-100";
      case "accepted":
        return "text-green-600 bg-green-50 border-green-100";
      case "rejected":
        return "text-red-600 bg-red-50 border-red-100";
      case "completed":
        return "text-blue-600 bg-blue-50 border-blue-100";
      case "active":
        return "text-green-600 bg-green-50 border-green-100";
      case "disputed":
        return "text-orange-600 bg-orange-50 border-orange-100";
      default:
        return "text-gray-600 bg-gray-50 border-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className="w-3 h-3 mr-1" />;
      case "accepted":
      case "active":
        return <CheckCircle2 className="w-3 h-3 mr-1" />;
      case "rejected":
        return <XCircle className="w-3 h-3 mr-1" />;
      case "completed":
        return <CheckCircle2 className="w-3 h-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="worker-container">
      <div className="worker-layout">
        <WorkerHeader title="My Applications" />

        {/* Custom Tabs */}
        <div className="px-4 py-4 sticky top-14 bg-white z-30 border-b border-gray-100">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("applications")}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                activeTab === "applications"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Applications
            </button>
            <button
              onClick={() => setActiveTab("assignments")}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                activeTab === "assignments"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Assignments
            </button>
          </div>
        </div>

        <div className="px-4 py-6 space-y-4 pb-32">
          {loading ? (
            <div className="flex justify-center py-20">
              <Spinner />
            </div>
          ) : activeTab === "applications" ? (
            applications.length > 0 ? (
              applications.map((app) => (
                <Link
                  href={`/worker/jobs/${app.jobId}`}
                  key={app.id}
                  className="block bg-white rounded-2xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                        {app.jobTitle || "Job Application"}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        ID: {app.jobId}
                      </p>
                    </div>
                    <div
                      className={`flex items-center text-[10px] font-bold px-2 py-1 rounded-full border ${getStatusColor(app.status)}`}
                    >
                      {getStatusIcon(app.status)}
                      {app.status.toUpperCase()}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1 text-gray-400" />
                      Applied on{" "}
                      {app.createdAt
                        ? new Date(app.createdAt).toLocaleDateString()
                        : "recently"}
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 transition-colors" />
                  </div>
                </Link>
              ))
            ) : (
              <EmptyState
                icon={<Briefcase className="w-12 h-12 text-gray-300" />}
                title="No applications"
                description="You haven't applied to any jobs yet."
                actionLink="/worker/search"
                actionLabel="Find Jobs"
              />
            )
          ) : assignments.length > 0 ? (
            assignments.map((assign) => (
              <div
                key={assign.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">
                      {assign.jobTitle || "Assigned Task"}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      Employer: {assign.employerId}
                    </p>
                  </div>
                  <div
                    className={`flex items-center text-[10px] font-bold px-2 py-1 rounded-full border ${getStatusColor(assign.status)}`}
                  >
                    {getStatusIcon(assign.status)}
                    {assign.status.toUpperCase()}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                  <div className="text-xs text-gray-500">
                    Assigned:{" "}
                    {assign.assignedAt
                      ? new Date(assign.assignedAt).toLocaleDateString()
                      : "recently"}
                  </div>
                  <Button size="sm" variant="outline" className="text-xs h-8">
                    View Details
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              icon={<ClipboardList className="w-12 h-12 text-gray-300" />}
              title="No jobs found"
              description="आपको अभी तक कोई काम नहीं सौंपा गया है।"
              actionLink="/worker/search"
              actionLabel="काम खोजें / Find Jobs"
            />
          )}
        </div>
      </div>
      <WorkerNav />
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
  actionLink,
  actionLabel,
}: any) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
      <div className="mb-4 bg-white p-4 rounded-2xl shadow-sm">{icon}</div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-8 max-w-[200px]">{description}</p>
      <Link href={actionLink}>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-xl">
          {actionLabel}
        </Button>
      </Link>
    </div>
  );
}
