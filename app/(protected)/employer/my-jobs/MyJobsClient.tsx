"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EmployerNav, EmployerNavLinks } from "@/components/navigation/EmployerNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PillTabs } from "@/components/ui/pill-tabs";
import { EmployerJob } from "@/lib/types/job";
import { deleteJob } from "@/lib/actions/job";
import { useUserStore } from "@/lib/stores/useUserStore";
import {
  Briefcase,
  ChevronLeft,
  Plus,
  Trash2,
  Users,
  Loader2,
} from "lucide-react";
import { getEmployerJobs } from "@/lib/queries/jobs";
import Spinner from "@/components/_shared/spinner";

type Tab = "open" | "closed";

export default function MyJobsClient() {
  const [activeTab, setActiveTab] = useState<Tab>("open");
  const [jobs, setJobs] = useState<EmployerJob[]>([]);
  const { user } = useUserStore();
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState<boolean>(true);
  const openJobs = jobs.filter((j) => j.isActive);
  const closedJobs = jobs.filter((j) => !j.isActive);
  const filteredJobs = activeTab === "open" ? openJobs : closedJobs;

  const handleDelete = async (jobId: string) => {
    if (!confirm("क्या आप इस नौकरी को डिलीट करना चाहते हैं? / Delete this job?"))
      return;

    try {
      setDeletingId(jobId);
      await deleteJob(jobId);
      startTransition(() => {
        router.refresh();
      });
    } catch (error: any) {
      alert(error.message || "Failed to delete job");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    if (!user) return;
    getEmployerJobs(1, 50).then((res) => {
      setJobs(res.jobs);
      setLoading(false);
    });
  }, [user]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/employer/home">
            <ChevronLeft className="w-6 h-6 cursor-pointer text-foreground" />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">My jobs</h1>
            <p className="text-sm text-muted-foreground">मेरी नौकरियाँ</p>
          </div>
          <EmployerNavLinks />
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <PillTabs
          items={[
            { key: "open", label: "Open", count: openJobs.length },
            { key: "closed", label: "Closed", count: closedJobs.length },
          ]}
          active={activeTab}
          onChange={(key) => setActiveTab(key as Tab)}
          className="mb-6"
        />
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="rounded-2xl border border-border bg-white p-4"
            >
              <div className="flex justify-between items-start gap-4 mb-1">
                <h3 className="font-bold text-foreground">{job.title}</h3>
                <p className="shrink-0 text-base font-bold text-primary">
                  ₹{job.minimumWage}
                </p>
              </div>

              <div className="mb-2">
                <Badge variant="outline">{job.primarySkill}</Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                {job.location?.formattedAddress || "N/A"}
                {" · "}
                {job.createdAt
                  ? new Date(job.createdAt).toLocaleDateString()
                  : "Recently"}
              </p>

              {job.isActive ? (
                <div className="flex gap-2">
                  <Link
                    href={`/employer/my-jobs/${job.id}/applications`}
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full">
                      <Users className="w-4 h-4 mr-2" />
                      View applicants
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    className="text-destructive border-destructive/40 hover:bg-danger-muted hover:text-destructive"
                    onClick={() => handleDelete(job.id)}
                    disabled={deletingId === job.id}
                  >
                    {deletingId === job.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              ) : (
                <Badge variant="default">CLOSED</Badge>
              )}
            </div>
          ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center rounded-2xl border border-border">
            <div className="mb-4 bg-accent p-4 rounded-2xl">
              <Briefcase className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              {activeTab === "open" ? "No open jobs" : "No closed jobs"}
            </h3>
            <p className="text-sm text-muted-foreground mb-8">
              {activeTab === "open"
                ? "Post a job to get started"
                : "No closed jobs yet"}
            </p>
            {activeTab === "open" && (
              <Link href="/employer/post-job">
                <Button size="lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Post job
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>

      <EmployerNav />
    </div>
  );
}
