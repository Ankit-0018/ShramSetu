"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EmployerNav } from "@/components/navigation/EmployerNav";
import { Button } from "@/components/ui/button";
import { Job } from "@/lib/types";
import { deleteJob } from "@/lib/actions/job";
import { useUserStore } from "@/lib/stores/useUserStore";
import {
  Briefcase,
  ChevronLeft,
  Plus,
  Trash2,
  Users,
  MapPin,
  Clock,
  Loader2,
} from "lucide-react";
import { getEmployerJobs } from "@/lib/queries/jobs";
import Spinner from "@/components/_shared/spinner";

type Tab = "open" | "closed";

export default function MyJobsClient() {
  const [activeTab, setActiveTab] = useState<Tab>("open");
  const [jobs,setJobs] = useState<Job[]>([]);
  const { user } = useUserStore();
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState<boolean>(true);
  const openJobs = jobs.filter((j) => j.status === "open");
  const closedJobs = jobs.filter((j) => j.status !== "open");
  const filteredJobs = activeTab === "open" ? openJobs : closedJobs;

  const handleDelete = async (jobId: string) => {
    if (!user?.uid) return;
    if (!confirm("क्या आप इस नौकरी को डिलीट करना चाहते हैं? / Delete this job?"))
      return;

    try {
      setDeletingId(jobId);
      await deleteJob(jobId, user.uid);
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

    if(!user?.uid) return;
  getEmployerJobs(user.uid).then((res) => {
    setJobs(res);
    setLoading(false)
  });
  },[user])


    if (loading) {
      return <Spinner />
    }
      if (!jobs) {
      return <div className="p-6">No jobs data found</div>;
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
            <h1 className="text-2xl font-bold">मेरी नौकरियाँ</h1>
            <p className="text-sm text-blue-100">My Jobs</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4 pt-4">
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          <button
            onClick={() => setActiveTab("open")}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              activeTab === "open"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            सक्रिय / Open ({openJobs.length})
          </button>
          <button
            onClick={() => setActiveTab("closed")}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              activeTab === "closed"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            बंद / Closed ({closedJobs.length})
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 space-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {job.description?.substring(0, 80)}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-lg font-bold text-green-600">
                    ₹{job.wage}
                  </p>
                  <p className="text-xs text-gray-500">{job.duration}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {job.skillsRequired?.map((skill) => (
                  <span
                    key={skill}
                    className="bg-blue-50 text-blue-700 text-[10px] px-2 py-0.5 rounded font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {job.location?.address || "N/A"}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {job.createdAt
                    ? new Date(job.createdAt).toLocaleDateString()
                    : "Recently"}
                </span>
              </div>

              <div className="flex gap-2">
                {job.status === "open" && (
                  <>
                    <Link
                      href={`/employer/my-jobs/${job.id}/applications`}
                      className="flex-1"
                    >
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-10 text-sm">
                        <Users className="w-4 h-4 mr-2" />
                        आवेदन देखें / View Applications
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(job.id)}
                      disabled={deletingId === job.id}
                    >
                      {deletingId === job.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </>
                )}
                {job.status !== "open" && (
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      job.status === "closed"
                        ? "bg-gray-100 text-gray-600"
                        : job.status === "completed"
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-600"
                    }`}
                  >
                    {job.status.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <div className="mb-4 bg-white p-4 rounded-2xl shadow-sm">
              <Briefcase className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {activeTab === "open"
                ? "कोई सक्रिय नौकरी नहीं"
                : "कोई बंद नौकरी नहीं"}
            </h3>
            <p className="text-sm text-gray-500 mb-8">
              {activeTab === "open"
                ? "Post a job to get started"
                : "No closed jobs yet"}
            </p>
            {activeTab === "open" && (
              <Link href="/employer/post-job">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-xl">
                  <Plus className="w-4 h-4 mr-2" />
                  नौकरी पोस्ट करें / Post Job
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
