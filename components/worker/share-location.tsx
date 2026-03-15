import { useLiveLocation } from "@/hooks/useLiveLocation";
import { useUserStore } from "@/lib/stores/useUserStore";
import { MapPin, MapPinOff } from "lucide-react";


const ShareLocation = () => {
  const { location } = useUserStore();
  const { startTracking, stopTracking, isTracking, locationLoading } =
    useLiveLocation();

  return (
    <>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isTracking ? (
              <MapPin className="w-5 h-5 text-blue-600" />
            ) : (
              <MapPinOff className="w-5 h-5 text-gray-400" />
            )}

            <div>
              <p className="text-sm font-semibold text-gray-900">
                Share Your Location
              </p>
              <p className="text-xs text-gray-600">
                {isTracking ? "On - Jobs visible within 3 km" : "Off"}
              </p>
            </div>
          </div>

          <button
            onClick={isTracking ? stopTracking : startTracking}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
              isTracking ? "bg-blue-600" : "bg-gray-300"
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
        <div className="bg-linear-to-br from-blue-100 to-cyan-100 rounded-2xl p-4 h-48 flex items-center justify-center relative border border-blue-200 overflow-hidden">
          <div className="text-center z-10">
            <div className="text-3xl mb-2">📍</div>
            <p className="text-xs font-medium text-gray-700">Your Location</p>
          </div>

          <div className="absolute w-32 h-32 rounded-full border-2 border-blue-300 border-dashed opacity-50"></div>
        </div>
      ) : null}
    </>
  );
};

export default ShareLocation;
