import { ShieldCheck, MapPin, ChevronRight } from "lucide-react";
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
        <WorkerHeader home />

        {/* Location Info */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2 min-w-0">
            <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
            {locationLoading ? (
              <Spinner fullscreen={false} />
            ) : (
              <span className="text-sm text-foreground truncate">
                {location ? `${location.address}` : "Location disabled"}
              </span>
            )}
          </div>
          <button className="text-sm font-medium text-primary shrink-0">
            Change
          </button>
        </div>

        {/* Main Content — single stacked column at every breakpoint */}
        <div className="px-4 py-5 pb-32">
          <div className="space-y-6">
            <WorkerStatus
              workStatus={workStatus}
              onStatusChange={onStatusChange}
            />
            <QuickStats workStatus={workStatus} data={data} />
          </div>

          <div className="space-y-6 mt-6">
            <ShareLocation />
            <WorkerProfile />

            {/* Verification Banner */}
            <div className="bg-accent rounded-2xl p-4 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-accent-foreground shrink-0" />
              <p className="min-w-0 flex-1 text-xs font-medium leading-relaxed text-accent-foreground">
                Add Aadhaar — verified workers get more jobs
              </p>
              <button className="flex items-center gap-0.5 whitespace-nowrap text-sm font-semibold text-primary shrink-0">
                Add
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <WorkerNav />
    </div>
  );
}
