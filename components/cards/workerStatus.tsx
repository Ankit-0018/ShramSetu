import { WorkingStatus } from "@/lib/types";

const STATUS_OPTIONS: {
  value: WorkingStatus;
  label: string;
  color: string;
}[] = [
  { value: "available", label: "Available", color: "bg-green-500" },
  { value: "busy", label: "Busy", color: "bg-yellow-500" },
  { value: "offline", label: "Offline", color: "bg-gray-400" },
];

type Props = {
    workStatus: WorkingStatus;
    onStatusChange: (newStatus: WorkingStatus) => void;
}

export default function WorkerStatus({workStatus, onStatusChange} : Props) {
      const statusInfo = STATUS_OPTIONS.find((s) => s.value === workStatus);
    return (
        <>
         {/* Status Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-700">
                Your Status
              </h2>
              <div
                className={`w-3 h-3 rounded-full ${statusInfo?.color}`}
              ></div>
            </div>

            {/* Status Selector */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {STATUS_OPTIONS.map((status) => (
                <button
                  key={status.value}
                  onClick={() => onStatusChange(status.value)}
                  className={`p-3 rounded-lg border-2 transition-all text-center text-xs font-medium ${
                    workStatus === status.value
                      ? "border-blue-600 bg-blue-50 text-blue-900"
                      : "border-gray-200 bg-white text-gray-700 hover:border-blue-300"
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>

            {/* Status Description */}
            <p className="text-xs text-gray-600">
              {workStatus === "available"
                ? "You are visible to employers."
                : workStatus === "busy"
                  ? "You are busy but still visible to employers."
                  : "You are not visible to employers."}
            </p>
          </div>
        </>
    );
}