"use client";

import { useEffect, useState } from "react";
import { WorkerNav } from "@/components/navigation/WorkerNav";
import { WorkerHeader } from "@/components/worker/worker-header";
import { useUserStore } from "@/lib/stores/useUserStore";
import { getMyApplications } from "@/lib/queries/applications";
import { getMyAssignedJobs } from "@/lib/queries/assignments";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PillTabs } from "@/components/ui/pill-tabs";
import {
  Briefcase,
  ChevronRight,
  ClipboardList,
} from "lucide-react";
import "@/styles/worker.css";
import Link from "next/link";
import Spinner from "@/components/_shared/spinner";
import { Application, Assignment } from "@/lib/types/job";

type Tab = "applications" | "assignments";

export default function MyApplicationsPage() {
  const { user } = useUserStore();
  const [activeTab, setActiveTab] = useState<Tab>("applications");
  const [applications, setApplications] = useState<Application[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [appsRes, assignsRes] = await Promise.all([
          getMyApplications(1, 20),
          getMyAssignedJobs(1, 20),
        ]);
        setApplications(appsRes.applications);
        setAssignments(assignsRes.assignments);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getStatusVariant = (
    status: string,
  ): "warning" | "success" | "danger" | "outline" | "default" => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "ACCEPTED":
        return "success";
      case "REJECTED":
        return "danger";
      case "COMPLETED":
        return "outline";
      case "IN_PROGRESS":
        return "success";
      case "CANCELLED":
        return "danger";
      default:
        return "default";
    }
  };

  return (
    <div className="worker-container">
      <div className="worker-layout">
        <WorkerHeader title="My Applications" />

        {/* Tabs */}
        <div className="px-4 py-4 sticky top-14 bg-background z-30 border-b border-border">
          <PillTabs
            items={[
              { key: "applications", label: "Applied", count: applications.length },
              { key: "assignments", label: "Assigned", count: assignments.length },
            ]}
            active={activeTab}
            onChange={(key) => setActiveTab(key as Tab)}
          />
        </div>

        <div className="px-4 py-2 pb-32">
          {loading ? (
            <div className="flex justify-center py-20">
              <Spinner />
            </div>
          ) : activeTab === "applications" ? (
            applications.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {applications.map((app) => (
                  <Link
                    href={`/worker/jobs/${app.jobId}`}
                    key={app.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="min-w-0">
                      <h3 className="font-bold text-foreground text-sm truncate">
                        {app.job?.title || "Job Application"}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {app.job?.location?.formattedAddress}
                        {app.job?.location?.formattedAddress && " · "}
                        {app.createdAt
                          ? new Date(app.createdAt).toLocaleDateString()
                          : "recently"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={getStatusVariant(app.status)}>
                        {app.status}
                      </Badge>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Briefcase className="w-12 h-12 text-muted-foreground" />}
                title="No applications"
                description="You haven't applied to any jobs yet."
                actionLink="/worker/search"
                actionLabel="Find Jobs"
              />
            )
          ) : assignments.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {assignments.map((assign) => (
                <div
                  key={assign.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4"
                >
                  <div className="min-w-0">
                    <h3 className="font-bold text-foreground text-sm truncate">
                      {assign.job?.title || "Assigned Task"}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {assign.job?.location?.formattedAddress}
                      {assign.job?.location?.formattedAddress && " · "}
                      {assign.createdAt
                        ? new Date(assign.createdAt).toLocaleDateString()
                        : "recently"}
                    </p>
                  </div>
                  <Badge variant={getStatusVariant(assign.status)}>
                    {assign.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<ClipboardList className="w-12 h-12 text-muted-foreground" />}
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
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="mb-4 bg-accent p-4 rounded-2xl">{icon}</div>
      <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-8 max-w-[220px]">{description}</p>
      <Link href={actionLink}>
        <Button size="lg" className="px-8">
          {actionLabel}
        </Button>
      </Link>
    </div>
  );
}
