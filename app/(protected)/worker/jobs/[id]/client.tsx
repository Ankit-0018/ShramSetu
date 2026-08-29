"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WorkerNav } from "@/components/navigation/WorkerNav";
import { WorkerHeader } from "@/components/worker/worker-header";
import {
  Briefcase,
  MapPin,
  Clock,
  ChevronLeft,
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
            className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </button>
        </div>

        <div className="px-4 pb-32 lg:pb-12 lg:grid lg:grid-cols-3 lg:gap-6 lg:items-start">
          {/* Main column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Job Image */}
            <div className="rounded-2xl overflow-hidden border border-border">
              <div className="relative h-48 lg:h-72 w-full bg-secondary">
                {job.imageUrls?.[0] ? (
                  <Image
                    src={job.imageUrls[0]}
                    alt="Job image"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    <Briefcase className="w-12 h-12 opacity-20" />
                  </div>
                )}
              </div>
            </div>

            {/* Title & Status */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={job.isActive ? "success" : "default"}>
                  {job.isActive ? "Active" : "Closed"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Posted {formattedDate}
                </span>
              </div>
              <h1 className="text-xl font-bold text-foreground mb-1">
                {job.title}
              </h1>
              <p className="text-2xl font-bold text-primary">
                ₹{job.minimumWage}{" "}
                <span className="text-sm font-medium text-muted-foreground">
                  / day
                </span>
              </p>
            </div>

            {/* Job Info Rows */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-accent-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {job.location.formattedAddress || "N/A"}
                  </p>
                  {typeof job.distanceKm === "number" && (
                    <p className="text-xs text-muted-foreground">
                      {job.distanceKm.toFixed(1)} km away
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-3 border-t border-border">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-accent-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{job.jobType}</p>
                  <p className="text-xs text-muted-foreground">Job type</p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-3 border-t border-border">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-accent-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{formattedDate}</p>
                  <p className="text-xs text-muted-foreground">Posted on</p>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="rounded-2xl border border-border bg-card p-4">
              <h2 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary" />
                What the job involves
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {job.description}
              </p>
            </div>

            {/* Skill Required */}
            <div className="rounded-2xl border border-border bg-card p-4">
              <h2 className="text-sm font-semibold text-foreground mb-3">
                Skill required
              </h2>
              <Badge variant="default">{job.primarySkill}</Badge>
            </div>
          </div>

          {/* Sidebar: employer + apply CTA */}
          <div className="mt-6 lg:mt-0 lg:col-span-1 lg:sticky lg:top-20 space-y-4">
            {/* Employer */}
            <div className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary flex-shrink-0 flex items-center justify-center font-bold text-primary-foreground text-lg">
                {job.employer.user.fullName?.charAt(0) || "E"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {job.employer.businessName || job.employer.user.fullName || "Employer"}
                </p>
                {/* NOTE: employer verification status isn't provided by the
                    backend, so a "Verified employer" badge isn't shown here. */}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  router.push(`/worker/employer/${job.employer.id}`)
                }
              >
                View Profile
              </Button>
            </div>

            {/* Action Button - in-flow sidebar version, lg+ only */}
            {job.isActive && (
              <div className="hidden lg:block rounded-2xl border border-border bg-card p-4">
                <Button
                  onClick={handleApply}
                  disabled={isApplying}
                  size="xl"
                  className="w-full shadow-xl flex items-center justify-center gap-2 group disabled:opacity-70"
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

        {/* Action Button - fixed bottom bar, mobile/below-lg only */}
        {job.isActive && (
          <div className="fixed bottom-24 left-0 right-0 px-4 max-w-[28rem] mx-auto z-40 lg:hidden">
            <Button
              onClick={handleApply}
              disabled={isApplying}
              size="xl"
              className="w-full shadow-xl flex items-center justify-center gap-2 group disabled:opacity-70"
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
      <WorkerNav />
    </div>
  );
}
