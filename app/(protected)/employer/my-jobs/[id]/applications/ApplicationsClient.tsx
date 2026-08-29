"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EmployerNav } from "@/components/navigation/EmployerNav";
import "@/styles/worker.css";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "PENDING":
        return "warning" as const;
      case "ACCEPTED":
        return "success" as const;
      case "REJECTED":
        return "danger" as const;
      default:
        return "outline" as const;
    }
  };

  const pendingApps = applications.filter((a) => a.status === "PENDING");
  const processedApps = applications.filter((a) => a.status !== "PENDING");

  return (
    <div className="worker-container">
      <div className="worker-layout">
        {/* Header */}
        <div className="worker-header">
          <div className="worker-header-content">
            <Link href="/employer/my-jobs" className="shrink-0">
              <ChevronLeft className="w-6 h-6 cursor-pointer text-foreground" />
            </Link>
            <div className="flex-1 min-w-0">
              <h1 className="text-base font-bold truncate text-foreground">
                Applications
              </h1>
              <p className="text-xs text-muted-foreground truncate">{job.title}</p>
            </div>
            <Badge variant="success" className="flex-shrink-0">
              ₹{job.minimumWage}
            </Badge>
          </div>
        </div>

        <div className="px-4 py-6 pb-32 space-y-6">
        {/* Job Summary */}
        <div className="bg-card rounded-2xl p-5 border border-border">
          <h3 className="font-bold text-foreground mb-2">{job.title}</h3>
          <p className="text-sm text-muted-foreground mb-3">
            {job.description?.substring(0, 120)}
          </p>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline">{job.primarySkill}</Badge>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            Status:{" "}
            <span
              className={`font-bold ${job.isActive ? "text-primary" : "text-muted-foreground"}`}
            >
              {job.isActive ? "OPEN" : "CLOSED"}
            </span>
          </div>
        </div>

        {/* Pending Applications */}
        {pendingApps.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-warning" />
              Pending ({pendingApps.length})
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {pendingApps.map((app) => (
                <div
                  key={app.id}
                  className="bg-card rounded-2xl p-5 border border-border"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                        <User className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">
                          {app.worker?.user.fullName || app.workerId}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Applied:{" "}
                          {app.createdAt
                            ? new Date(app.createdAt).toLocaleDateString()
                            : "Recently"}
                        </p>
                      </div>
                    </div>
                    <Badge variant={getStatusVariant(app.status)}>PENDING</Badge>
                  </div>

                  {job.isActive && (
                    <div className="flex gap-3">
                      <Button
                        className="flex-1"
                        size="sm"
                        onClick={() => handleAccept(app.id)}
                        disabled={processingId === app.id}
                      >
                        {processingId === app.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-destructive/30 text-destructive hover:bg-danger-muted"
                        size="sm"
                        onClick={() => handleReject(app.id)}
                        disabled={processingId === app.id}
                      >
                        {processingId === app.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        Reject
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
            <h3 className="text-lg font-bold text-foreground mb-4">
              Processed
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {processedApps.map((app) => (
                <div
                  key={app.id}
                  className="bg-card rounded-2xl p-4 border border-border flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground">
                        {app.worker?.user.fullName || app.workerId}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {app.createdAt
                          ? new Date(app.createdAt).toLocaleDateString()
                          : "Recently"}
                      </p>
                    </div>
                  </div>
                  <Badge variant={getStatusVariant(app.status)}>
                    {app.status.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {applications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-secondary rounded-3xl border-2 border-dashed border-border">
            <div className="mb-4 bg-card p-4 rounded-2xl border border-border">
              <User className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              No applications yet
            </h3>
            <p className="text-sm text-muted-foreground">
              No applications for this job yet
            </p>
          </div>
        )}
        </div>
      </div>

      <EmployerNav />
    </div>
  );
}
