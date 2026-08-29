import { WorkingStatus } from "@/lib/types";

const STATUS_OPTIONS: {
  value: WorkingStatus;
  label: string;
  color: string;
}[] = [
  { value: "available", label: "Available", color: "bg-green-500" },
  { value: "busy", label: "Busy", color: "bg-yellow-500" },
  { value: "offline", label: "Off", color: "bg-gray-400" },
];

type Props = {
    workStatus: WorkingStatus;
    onStatusChange: (newStatus: WorkingStatus) => void;
}

export default function WorkerStatus({workStatus, onStatusChange} : Props) {
    return (
        <>
         {/* Status Toggle */}
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-2">
              Today I am
            </h2>

            {/* Segmented Pill Selector */}
            <div className="grid grid-cols-3 gap-1 rounded-full bg-secondary p-1">
              {STATUS_OPTIONS.map((status) => (
                <button
                  key={status.value}
                  onClick={() => onStatusChange(status.value)}
                  className={`h-10 rounded-full transition-all text-center text-sm font-medium ${
                    workStatus === status.value
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>
        </>
    );
}