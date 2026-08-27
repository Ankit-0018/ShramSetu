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
  if (!user) return;

  const handleClearLocation = () => {
    stopTracking();
  };
  return (
    <div className="space-y-3">
      {/* Location display */}
      <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <MapPin className="w-5 h-5 text-blue-600 shrink-0" />

        {locationLoading ? (
          <span className="text-sm text-gray-600">Detecting location…</span>
        ) : location?.address ? (
          <span className="text-sm text-gray-900">{location.address}</span>
        ) : (
          <span className="text-sm text-gray-600">Location not selected</span>
        )}

        <span className="ml-auto text-xs text-gray-600">3 km radius</span>
      </div>

      {/* Map (optional) */}
      {showMap && location && (
        <div className="w-full h-75 rounded-lg overflow-hidden border">
          <LiveMap lat={location.lat} lng={location.lng} />
        </div>
      )}

      {/* Error */}
      {locationError && <p className="text-xs text-red-600">{locationError}</p>}

      {/* Action */}
      <button
        type="button"
        onClick={location ? handleClearLocation : startTracking}
        className={`px-3 py-1.5 text-xs font-medium rounded-md text-white ${
          location
            ? "bg-red-600 hover:bg-red-700"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {location ? "Stop Location" : "Select Location"}
      </button>

      <p className="text-xs text-gray-600">
        Automatically detected using your device's GPS.
      </p>
    </div>
  );
}
