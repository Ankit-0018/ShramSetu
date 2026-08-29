"use client";

import { useLiveLocation } from "@/hooks/useLiveLocation";
import { MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import { useUserStore } from "@/lib/stores/useUserStore";

const LiveMap = dynamic(() => import("@/components/common/LiveMap"), {
  ssr: false,
});

interface LocationFieldProps {
  showMap?: boolean;
}

export default function LocationField({ showMap = false }: LocationFieldProps) {
  const { user, location, locationError, locationLoading } = useUserStore();
  const { startTracking, isTracking, stopTracking } = useLiveLocation();
  if (!user) return null;

  const handleClearLocation = () => {
    stopTracking();
  };
  return (
    <div className="space-y-3">
      {/* Location display */}
      <div className="flex items-center gap-2 rounded-xl bg-secondary p-3">
        <MapPin className="w-5 h-5 text-primary shrink-0" />

        {locationLoading ? (
          <span className="text-sm text-muted-foreground">Detecting location…</span>
        ) : location?.address ? (
          <span className="text-sm text-foreground">{location.address}</span>
        ) : (
          <span className="text-sm text-muted-foreground">Location not selected</span>
        )}

        <span className="ml-auto text-xs text-muted-foreground">3 km radius</span>
      </div>

      {/* Map (optional) */}
      {showMap && location && (
        <div className="w-full h-75 rounded-2xl overflow-hidden border border-border">
          <LiveMap lat={location.lat} lng={location.lng} />
        </div>
      )}

      {/* Error */}
      {locationError && <p className="text-xs text-destructive">{locationError}</p>}

      {/* Action */}
      <button
        type="button"
        onClick={location ? handleClearLocation : startTracking}
        className={`rounded-full px-4 py-1.5 text-xs font-semibold text-white transition ${
          location
            ? "bg-destructive hover:bg-destructive/90"
            : "bg-primary hover:bg-primary/90"
        }`}
      >
        {location ? "Stop Location" : "Select Location"}
      </button>

      <p className="text-xs text-muted-foreground">
        Automatically detected using your device&apos;s GPS.
      </p>
    </div>
  );
}
