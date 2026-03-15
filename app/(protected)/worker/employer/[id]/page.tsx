"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { WorkerNav } from "@/components/navigation/WorkerNav";
import { WorkerHeader } from "@/components/worker/worker-header";
import {
  User,
  MapPin,
  Star,
  ChevronLeft,
  ShieldCheck,
  Calendar,
  Briefcase,
  Award,
} from "lucide-react";
import "@/styles/worker.css";

import { useEffect, useState } from "react";
import { getEmployerProfile } from "@/lib/queries/employer";
import { Loader2 } from "lucide-react";
import Spinner from "@/components/_shared/spinner";

export default function EmployerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [employer, setEmployer] = useState<any>(null);
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
                  {employer.fullName?.charAt(0) ||
                    employer.name?.charAt(0) ||
                    "U"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-gray-900">
                      {employer.fullName || employer.name}
                    </h1>
                    {employer.verified && (
                      <ShieldCheck className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {employer.company || "Individual"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  {employer.location?.city || "Unknown Location"}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  Joined {employer.memberSince}
                </div>
                <div className="flex items-center text-sm text-yellow-600 font-semibold">
                  <Star className="w-4 h-4 mr-2 fill-current" />
                  {employer.averageRating || 0} ({employer.ratingCount || 0}{" "}
                  reviews)
                </div>
                <div className="flex items-center text-sm text-blue-600 font-semibold">
                  <Briefcase className="w-4 h-4 mr-2" />
                  {employer.totalJobsPosted || 0} Jobs Posted
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <User className="w-4 h-4 mr-2 text-blue-500" />
              About
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {employer.description || "No description provided"}
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-green-50 rounded-xl p-3 border border-green-100 text-center">
              <div className="text-lg font-bold text-green-700">100%</div>
              <p className="text-[10px] text-green-600 font-medium">
                Payment Rate
              </p>
            </div>
            <div className="bg-blue-50 rounded-xl p-3 border border-blue-100 text-center">
              <div className="text-lg font-bold text-blue-700">
                {employer.activeJobs}
              </div>
              <p className="text-[10px] text-blue-600 font-medium">
                Active Jobs
              </p>
            </div>
            <div className="bg-purple-50 rounded-xl p-3 border border-purple-100 text-center">
              <div className="text-lg font-bold text-purple-700">4.9/5</div>
              <p className="text-[10px] text-purple-600 font-medium">
                Worker Satisfaction
              </p>
            </div>
          </div>

          {/* Past Experience / Reviews */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
              <Award className="w-4 h-4 mr-2 text-yellow-500" />
              Past Reviews
            </h2>
            <div className="space-y-4">
              {employer.pastJobs && employer.pastJobs.length > 0 ? (
                employer.pastJobs.map((job: any, idx: number) => (
                  <div
                    key={idx}
                    className={`pb-4 ${idx !== employer.pastJobs.length - 1 ? "border-b border-gray-100" : ""}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {job.title}
                      </h3>
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < job.rating ? "fill-current" : "text-gray-200"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">{job.date}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 text-center py-4">
                  No reviews yet
                </p>
              )}
            </div>
            {employer.pastJobs && employer.pastJobs.length > 0 && (
              <Button
                variant="outline"
                className="w-full mt-4 text-xs font-semibold text-gray-600"
              >
                Show All Reviews
              </Button>
            )}
          </div>
        </div>
      </div>
      <WorkerNav />
    </div>
  );
}
