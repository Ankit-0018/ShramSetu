import { AlertCircle, Briefcase, MapPin } from "lucide-react";
import { WorkerHeader } from "./worker-header";
import { useUserStore } from "@/lib/stores/useUserStore";
import Spinner from "../_shared/spinner";
import { WorkerDashboardData, WorkingStatus } from "@/lib/types";
import ShareLocation from "./share-location";
import { WorkerNav } from "../navigation/WorkerNav";
import WorkerStatus from "@/components/cards/workerStatus";
import WorkerProfile from "../cards/workerProfile";
import QuickStats from "./QuickStatus";

type Props = {
  workStatus: WorkingStatus;
  onStatusChange: (newStatus: WorkingStatus) => void;
  data: WorkerDashboardData | null;
};

export default function WorkerHomeUI({
  workStatus,
  onStatusChange,
  data,
}: Props) {
  const { location, locationLoading } = useUserStore();

  return (
    <div className="worker-container">
      <div className="worker-layout">
        <WorkerHeader  home />

        {/* Location Info */}
        <div className="location-info">
          <MapPin className="w-4 h-4" />
          {locationLoading ? (
            <Spinner fullscreen={false} />
          ) : (
            <span className="text-sm">
              {location ? `${location.address}` : "Location disabled"}
            </span>
          )}
        </div>

        {/* Main Content */}
        <div className="px-4 py-6 space-y-4 pb-32">
          <WorkerStatus
            workStatus={workStatus}
            onStatusChange={onStatusChange}
          />
          <ShareLocation />
          <QuickStats workStatus={workStatus} data={data} />
          <WorkerProfile />

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 shrink--0 mt-0.5" />
            <div className="text-xs text-blue-900">
              <p className="font-medium mb-1">Complete Your Profile</p>
              <p>
                Add your photo and reviews to increase your chances of getting
                hired.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <WorkerNav />
    </div>
  );
}
