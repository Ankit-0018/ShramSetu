"use client";

import { Plus, Users, Briefcase, ClipboardList, BatteryWarning, MessageSquareWarning } from "lucide-react";
import Link from "next/link";
import { EmployerNav } from "@/components/navigation/EmployerNav";
import { LanguageToggle } from "@/components/_shared/language-toggle";
import { EmployerDashboardData, Job, Application } from "@/lib/types";
import { useUserStore } from "@/lib/stores/useUserStore";
import { useEffect, useState } from "react";
import { getEmployerDashboard } from "@/lib/queries/dashboard";
import Spinner from "@/components/_shared/spinner";
import Image from "next/image";
import Logo from "@/public/logo.png"
type Props = {
  data: EmployerDashboardData;
};

export default function EmployerHomeUI() {
  const { user } = useUserStore();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    getEmployerDashboard(user.uid).then((res) => {
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
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white pb-24">
      {/* Header */}
     <div className="sticky top-0 z-40 bg-white shadow-sm">
  <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
    
    <div className="flex items-center gap-3">
      <Image
        src={Logo}
        alt="Shram Setu"
        width={120}
        height={150}
        priority
      />
      <div>
        <p className="text-sm text-blue-600">Employer</p>
      </div>
    </div>

    <LanguageToggle />

  </div>
</div>
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Welcome */}
        <div className="bg-white rounded-2xl p-6 border shadow-sm">
          <h2 className="text-xl font-bold mb-2">Welcome Back</h2>
          <p className="text-gray-600">
            Post jobs and hire workers to complete your projects efficiently.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Stat
            value={stats.activeJobsCount}
            label="Active Jobs"
            color="text-blue-600"
          />
          <Stat
            value={stats.applicationsCount}
            label="Pending"
            color="text-green-600"
          />
          <Stat
            value={stats.completedJobsCount}
            label="Completed"
            color="text-purple-600"
          />
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/employer/post-job">
            <ActionCard
              icon={<Plus className="w-10 h-10" />}
              title="Post a New Job"
              subtitle="Create job listings"
              color="from-blue-600 to-blue-700"
            />
          </Link>

          <Link href="/employer/my-jobs">
            <ActionCard
              icon={<Briefcase className="w-10 h-10" />}
              title="My Jobs"
              subtitle="View jobs & applications"
              color="from-green-600 to-green-700"
            />
          </Link>

          <Link href="/employer/assignments">
            <ActionCard
              icon={<ClipboardList className="w-10 h-10" />}
              title="Assignments"
              subtitle="Manage active assignments"
              color="from-purple-600 to-purple-700"
            />
          </Link>

          <Link href="/employer/home">
            <ActionCard
              icon={<Users className="w-10 h-10" />}
              title="Find Workers"
              subtitle="Search Qualified Workers"
              color="from-orange-600 to-orange-700"
              underConstruction
            />
          </Link>
        </div>

        {/* Active Jobs */}
        <div className="bg-white rounded-2xl p-6 border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Active Jobs</h3>
            <Link
              href="/employer/my-jobs"
              className="text-sm text-blue-600 font-medium"
            >
              View All →
            </Link>
          </div>

          {activeJobs.length > 0 ? (
            activeJobs.slice(0, 5).map((job: Job) => (
              <Link
                key={job.id}
                href={`/employer/my-jobs/${job.id}/applications`}
                className="block border rounded-lg p-4 mb-3 hover:shadow-md transition group"
              >
                <div className="flex justify-between mb-2">
                  <div>
                    <h4 className="font-semibold group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {job.description?.substring(0, 60)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">₹{job.wage}</p>
                    <p className="text-xs text-gray-600">{job.duration}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {job.skillsRequired?.map((skill) => (
                    <span
                      key={skill}
                      className="bg-blue-50 text-blue-700 text-[10px] px-2 py-0.5 rounded font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 text-sm text-center py-8">
              No active jobs
            </p>
          )}
        </div>

        {/* Pending Applications */}
        {pendingApplications.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Pending Applications</h3>
              <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full">
                {pendingApplications.length}
              </span>
            </div>

            {pendingApplications.slice(0, 5).map((app: Application) => (
              <Link
                key={app.id}
                href={`/employer/my-jobs/${app.jobId}/applications`}
                className="block border rounded-lg p-4 mb-3 hover:shadow-md transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-sm">
                      {app.jobTitle || "Job Application"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Worker: {app.workerId}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-yellow-50 text-yellow-600 border border-yellow-100">
                    PENDING
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Active Assignments */}
        {activeAssignments.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Active Assignments</h3>
              <Link
                href="/employer/assignments"
                className="text-sm text-blue-600 font-medium"
              >
                View All →
              </Link>
            </div>

            {activeAssignments.slice(0, 3).map((assign: any) => (
              <div
                key={assign.id}
                className="border rounded-lg p-4 mb-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-sm">
                    Worker: {assign.workerId}
                  </p>
                  <p className="text-xs text-gray-500">Job: {assign.jobId}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-green-50 text-green-600 border border-green-100">
                  ACTIVE
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <EmployerNav />
    </div>
  );
}

function Stat({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl p-4 border shadow-sm text-center">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <p className="text-xs text-gray-600">{label}</p>
    </div>
  );
}

function ActionCard({
  icon,
  title,
  subtitle,
  color,
  underConstruction = false
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: string;
  underConstruction?: boolean;
}) {
  return (
    <div
      className={`bg-linear-to-br ${color} text-white rounded-2xl p-6 hover:shadow-lg transition`}
    >
      {icon}

      <h3 className="text-lg font-bold mt-2">{title}</h3>

      <p className="text-sm opacity-90">{subtitle}</p>

      {underConstruction && (
        <div className="flex items-center gap-2 mt-3 text-sm opacity-90">
          <MessageSquareWarning size={16} />
          <p>Feature coming soon...</p>
        </div>
      )}
    </div>
  );
}
