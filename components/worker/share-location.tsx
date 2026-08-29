import { useLiveLocation } from "@/hooks/useLiveLocation";
import { useUserStore } from "@/lib/stores/useUserStore";
import { MapPin, MapPinOff } from "lucide-react";


const ShareLocation = () => {
  const { location } = useUserStore();
  const { startTracking, stopTracking, isTracking, locationLoading } =
    useLiveLocation();

  return (
    <>
      <div className="bg-white rounded-2xl p-4 border border-border">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {isTracking ? (
              <MapPin className="w-5 h-5 text-primary shrink-0" />
            ) : (
              <MapPinOff className="w-5 h-5 text-muted-foreground shrink-0" />
            )}

            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                Share Your Location
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {isTracking ? "On - Jobs visible within 3 km" : "Off"}
              </p>
            </div>
          </div>

          <button
            onClick={isTracking ? stopTracking : startTracking}
            className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition-colors ${
              isTracking ? "bg-primary" : "bg-secondary"
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                isTracking ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {location && isTracking ? (
        <div className="bg-accent rounded-2xl p-4 h-48 flex items-center justify-center relative border border-border overflow-hidden">
          <div className="text-center z-10">
            <div className="text-3xl mb-2">📍</div>
            <p className="text-xs font-medium text-accent-foreground">Your Location</p>
          </div>

          <div className="absolute w-32 h-32 rounded-full border-2 border-primary/30 border-dashed opacity-50"></div>
        </div>
      ) : null}
    </>
  );
};

export default ShareLocation;
