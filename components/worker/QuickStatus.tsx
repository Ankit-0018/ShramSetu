import { Briefcase } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { WorkerDashboardData, WorkingStatus } from "@/lib/types";
type Props = {
    workStatus: WorkingStatus;
    data: WorkerDashboardData | null;
}

export default function QuickStats({workStatus, data}: Props) {
      const isWorking = workStatus !== "offline";
    return (
        <>
         {/* Quick Stats */}
          {isWorking && (
              <>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <div className="text-2xl font-bold text-blue-600">
                    {data?.nearbyJobsCount ?? 0}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Nearby Jobs</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <div className="text-2xl font-bold text-green-600">
                    {data?.closestJobDistance ?? "N/A"}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Closest Job</p>
                </div>
              </div>

              {/* Earnings Card */}
              <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                <p className="text-xs text-gray-600 mb-1">Today&apos;s Earnings</p>
                <p className="text-3xl font-bold text-green-600">
                  ₹{data?.todayEarnings ?? 0}
                </p>
              </div>

              {/* Action Button */}
              <Link href="/worker/search">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl">
                  <Briefcase className="w-4 h-4 mr-2" />
                  View Nearby Jobs
                </Button>
              </Link>
            </>
          )}
          </>
    );
}