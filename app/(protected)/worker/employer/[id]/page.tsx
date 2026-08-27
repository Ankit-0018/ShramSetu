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
            className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </button>
        </div>

        <div className="px-4 space-y-6 pb-32">
          {/* Header Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50 z-0"></div>

            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg mr-4">
                  {employer.fullName?.charAt(0) || "U"}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {employer.fullName}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {employerProfile?.businessName || "Individual"}
                  </p>
                </div>
              </div>

              {/* NOTE: ratings/reviews aren't provided by the backend yet, so
                  that UI has been removed rather than showing fake data. */}
              {employerProfile?.employerType && (
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-600">
                    <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                    {employerProfile.employerType}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <User className="w-4 h-4 mr-2 text-blue-500" />
              About
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
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
