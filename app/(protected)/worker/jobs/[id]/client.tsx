"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { WorkerNav } from "@/components/navigation/WorkerNav";
import { WorkerHeader } from "@/components/worker/worker-header";
import {
  Briefcase,
  MapPin,
  Clock,
  ChevronLeft,
  CheckCircle2,
  Calendar,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import "@/styles/worker.css";
import { JobDetail } from "@/lib/types/job";
import { useEffect, useState } from "react";
import { useUserStore } from "@/lib/stores/useUserStore";
import { applyToJob } from "@/lib/actions/job";
import { getJobById } from "@/lib/queries/jobs";
import Spinner from "@/components/_shared/spinner";

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { user } = useUserStore();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadJob = async () => {
      setLoading(true);
      try {
        const data = await getJobById(id);
        setJob(data);
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      alert("Please log in to apply");
      return;
    }

    if (!job) return;

    try {
      setIsApplying(true);
      await applyToJob(job.id);
      alert("Applied successfully!");
      // router.push('/worker/applications'); // Optional: redirect to applications page
    } catch (error) {
      console.error("Error applying to job:", error);
      alert("Failed to apply. Please try again.");
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (!job) {
    return (
      <div className="worker-container flex items-center justify-center min-h-screen">
        <p>Job not found</p>
      </div>
    );
  }

  const formattedDate = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString()
    : "Recently";

  return (
    <div className="worker-container">
      <div className="worker-layout">
        <WorkerHeader title="Job Details" />

        {/* Back Button */}
        <div className="px-4 py-3">
          <button
            onClick={() => router.back()}
            className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </button>
        </div>

        <div className="px-4 space-y-6 pb-32">
          {/* Job Image & Basic Info */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            <div className="relative h-48 w-full bg-gray-100">
              {job.imageUrls?.[0] ? (
                <Image
                  src={job.imageUrls[0]}
                  alt="Job image"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <Briefcase className="w-12 h-12 opacity-20" />
                </div>
              )}
              <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                ₹{job.minimumWage} / {job.jobType}
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-xl font-bold text-gray-900">{job.title}</h1>
                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md font-medium">
                  {job.isActive ? "Open" : "Closed"}
                </span>
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                  {job.location.formattedAddress || "N/A"}
                </div>
                <div className="flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-gray-400" />
                  {job.jobType}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-gray-400" />
                  {formattedDate}
                </div>
                {typeof job.distanceKm === "number" && (
                  <div className="flex items-center">
                    {job.distanceKm.toFixed(1)} km away
                  </div>
                )}
              </div>

              <div className="flex items-center pt-4 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex-shrink-0 mr-3 flex items-center justify-center font-bold text-blue-600">
                  {job.employer.user.fullName?.charAt(0) || "E"}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {job.employer.businessName || job.employer.user.fullName || "Employer"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-blue-600"
                  onClick={() =>
                    router.push(`/worker/employer/${job.employer.id}`)
                  }
                >
                  View Profile
                </Button>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
              Description
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Skill Required */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <Briefcase className="w-4 h-4 mr-2 text-blue-500" />
              Skill Required
            </h2>
            <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-lg font-medium inline-block">
              {job.primarySkill}
            </span>
          </div>

          {/* Action Button */}
          {job.isActive && (
            <div className="fixed bottom-24 left-0 right-0 px-4 max-w-[28rem] mx-auto z-40">
              <Button
                onClick={handleApply}
                disabled={isApplying}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-14 rounded-2xl shadow-xl flex items-center justify-center gap-2 group disabled:opacity-70"
              >
                {isApplying ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Briefcase className="w-5 h-5 group-hover:scale-110 transition-transform" />
                )}
                <span className="text-lg font-bold">
                  {isApplying ? "Applying..." : "Apply Now"}
                </span>
              </Button>
            </div>
          )}
        </div>
      </div>
      <WorkerNav />
    </div>
  );
}
