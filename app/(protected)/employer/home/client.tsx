"use client";

import { Plus, Users, Briefcase, ClipboardList, ChevronRight } from "lucide-react";
import Link from "next/link";
import { EmployerNav, EmployerNavLinks } from "@/components/navigation/EmployerNav";
import { LanguageToggle } from "@/components/_shared/language-toggle";
import { Badge } from "@/components/ui/badge";
import { EmployerDashboardData } from "@/lib/types";
import { EmployerJob, Application } from "@/lib/types/job";
import { useUserStore } from "@/lib/stores/useUserStore";
import { useEffect, useState } from "react";
import { getEmployerDashboard } from "@/lib/queries/dashboard";
import Spinner from "@/components/_shared/spinner";
import Image from "next/image";
import Logo from "@/public/logo-icon.png"

function timeAgo(dateString: string) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function EmployerHomeUI() {
  const { user } = useUserStore();

  const [data, setData] = useState<EmployerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    getEmployerDashboard().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [user]);


  if (loading) {
    return <Spinner />
  }

  if (!data) {
    return <div className="p-6">No dashboard data found</div>;
  }

  const { stats, activeJobs, pendingApplications, activeAssignments } = data;
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <Image
              src={Logo}
              alt="ApnaKaam"
              width={40}
              height={40}
              priority
              className="rounded-xl"
            />
            <div>
              <p className="font-bold leading-tight">{user?.fullName || "Employer"}</p>
              <p className="text-xs text-muted-foreground">Employer</p>
            </div>
          </div>

          <EmployerNavLinks />

          <LanguageToggle />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:items-start">
        {/* Main column: stats + post job + actions + live jobs */}
        <div className="space-y-6 lg:col-span-2">
          {/* Stats */}
          <div className="grid grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-white py-4">
            <Stat value={stats.activeJobsCount} label="Live jobs" />
            <Stat value={stats.applicationsCount} label="New applicants" />
            <Stat value={stats.completedJobsCount} label="Active" />
          </div>

          {/* Post a new job */}
          <Link
            href="/employer/post-job"
            className="flex items-center justify-center gap-2 w-full h-14 rounded-full bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition lg:hidden"
          >
            <Plus className="w-5 h-5" />
            Post a new job
          </Link>

          {/* Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/employer/post-job">
              <ActionCard
                icon={<Plus className="w-5 h-5" />}
                title="Post a New Job"
                subtitle="Create job listings"
                color="bg-accent text-accent-foreground"
              />
            </Link>

            <Link href="/employer/my-jobs">
              <ActionCard
                icon={<Briefcase className="w-5 h-5" />}
                title="My Jobs"
                subtitle="View jobs & applications"
                color="bg-blue-50 text-blue-600"
              />
            </Link>

            <Link href="/employer/assignments">
              <ActionCard
                icon={<ClipboardList className="w-5 h-5" />}
                title="Assignments"
                subtitle="Manage active assignments"
                color="bg-purple-50 text-purple-600"
              />
            </Link>

            <Link href="/employer/search-workers">
              <ActionCard
                icon={<Users className="w-5 h-5" />}
                title="Find Workers"
                subtitle="Search qualified workers"
                color="bg-warning-muted text-warning-muted-foreground"
              />
            </Link>
          </div>

          {/* Live Jobs */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">Live jobs</h3>
              <Link
                href="/employer/my-jobs"
                className="text-sm text-primary font-semibold"
              >
                See all
              </Link>
            </div>

            {activeJobs.length > 0 ? (
              <div className="rounded-2xl border border-border bg-white divide-y divide-border overflow-hidden">
                {activeJobs.slice(0, 5).map((job: EmployerJob) => (
                  <Link
                    key={job.id}
                    href={`/employer/my-jobs/${job.id}/applications`}
                    className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-secondary/50 transition"
                  >
                    <div className="min-w-0">
                      <h4 className="font-bold truncate">{job.title}</h4>
                      <p className="text-sm text-muted-foreground truncate">
                        {job.location.formattedAddress || job.primarySkill} · {timeAgo(job.createdAt)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-primary">₹{job.minimumWage}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-white">
                <p className="text-muted-foreground text-sm text-center py-8">
                  No active jobs
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Side column: post job button (lg+) + new applicants + active assignments */}
        <div className="space-y-6 lg:col-span-1">
          {/* Post a new job (lg+ only, lives at top of side column) */}
          <Link
            href="/employer/post-job"
            className="hidden lg:flex items-center justify-center gap-2 w-full h-14 rounded-full bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition"
          >
            <Plus className="w-5 h-5" />
            Post a new job
          </Link>

          {/* New Applicants */}
          {pendingApplications.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold">New applicants</h3>
                <Badge variant="warning">{pendingApplications.length}</Badge>
              </div>

              <div className="rounded-2xl border border-border bg-white divide-y divide-border overflow-hidden">
                {pendingApplications.slice(0, 5).map((app: Application) => {
                  const name = app.worker?.user.fullName || "Applicant";
                  return (
                    <Link
                      key={app.id}
                      href={`/employer/my-jobs/${app.jobId}/applications`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition"
                    >
                      <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-semibold text-sm shrink-0">
                        {initials(name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold truncate">{name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {app.job?.title || "Job Application"}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Active Assignments */}
          {activeAssignments.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold">Active assignments</h3>
                <Link
                  href="/employer/assignments"
                  className="text-sm text-primary font-semibold"
                >
                  See all
                </Link>
              </div>

              <div className="rounded-2xl border border-border bg-white divide-y divide-border overflow-hidden">
                {activeAssignments.slice(0, 3).map((assign) => (
                  <div
                    key={assign.id}
                    className="flex items-center justify-between gap-3 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="font-bold truncate">
                        {assign.worker?.user.fullName || "Worker"}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {assign.job?.title || "Job"}
                      </p>
                    </div>
                    <Badge variant="success">Active</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <EmployerNav />
    </div>
  );
}

function Stat({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="text-center px-2">
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

function ActionCard({
  icon,
  title,
  subtitle,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4 hover:shadow-md transition">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>

      <h3 className="font-bold mt-3">{title}</h3>

      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}
