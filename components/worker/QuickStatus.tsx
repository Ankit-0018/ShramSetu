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
              {/* Stats Row */}
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-2xl font-bold text-foreground">
                    ₹{data?.todayEarnings ?? 0}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Earned today
                  </p>
                </div>
                <div className="w-px h-10 bg-border mx-4" />
                <div className="flex-1">
                  <p className="text-2xl font-bold text-foreground">
                    {data?.nearbyJobsCount ?? 0}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Jobs nearby
                    {data?.closestJobDistance
                      ? ` · ${data.closestJobDistance}`
                      : ""}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <Link href="/worker/search">
                <Button variant="default" size="lg" className="w-full">
                  <Briefcase className="w-4 h-4 mr-2" />
                  View Nearby Jobs
                </Button>
              </Link>
            </>
          )}
          </>
    );
}