"use client";

import { useParams, useRouter } from "next/navigation";
import { WorkerNav } from "@/components/navigation/WorkerNav";
import { WorkerHeader } from "@/components/worker/worker-header";
import {
  User,
  ChevronLeft,
  Building2,
} from "lucide-react";
import "@/styles/worker.css";

import { useEffect, useState } from "react";
import { getEmployerProfile, type PublicProfile } from "@/lib/queries/employer";
import Spinner from "@/components/_shared/spinner";

export default function EmployerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [employer, setEmployer] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployer = async () => {
      if (!id) return;
      try {
        const data = await getEmployerProfile(id);
        setEmployer(data);
      } catch (error) {
        console.error("Error fetching employer:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployer();
  }, [id]);

  if (loading) {
    return (
      <Spinner />
    );
  }

  if (!employer) {
    return (
      <div className="worker-container flex items-center justify-center min-h-screen">
        <p>Employer not found</p>
      </div>
    );
  }

  const employerProfile = employer.employerProfile;

  return (
    <div className="worker-container">
      <div className="worker-layout">
        <WorkerHeader title="Employer Profile" />

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

        <div className="px-4 space-y-6 pb-32 lg:max-w-2xl lg:mx-auto">
          {/* Header Card */}
          <div className="flex flex-col items-start px-2">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold mb-4">
              {employer.fullName?.charAt(0) || "U"}
            </div>
            <h1 className="text-xl font-bold text-foreground">
              {employer.fullName}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {employerProfile?.businessName || "Individual"}
            </p>
            {/* NOTE: employer verification status isn't provided by the
                backend yet, so a "Verified employer" badge isn't shown. */}
          </div>

          {/* NOTE: ratings/reviews aren't provided by the backend yet, so
              that UI has been removed rather than showing fake data. */}

          {/* Info rows */}
          {employerProfile?.employerType && (
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-accent-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Employer type</p>
                  <p className="font-medium truncate">
                    {employerProfile.employerType}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* About Section */}
          <div className="rounded-2xl border border-border bg-card p-4">
            <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              About
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {employerProfile?.gstNumber
                ? `GST: ${employerProfile.gstNumber}`
                : "No additional information provided"}
            </p>
          </div>
        </div>
      </div>
      <WorkerNav />
    </div>
  );
}
