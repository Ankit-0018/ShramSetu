"use client";

import { Badge } from "@/components/ui/badge";
import { NearbyJob } from "@/lib/types/job";
import { useRouter } from "next/navigation";

interface JobCardProps {
    job: NearbyJob;
}

export function JobCard({ job }: JobCardProps) {
    const router = useRouter();

    const handleViewJob = (jobId: string) => {
        router.push(`/worker/jobs/${jobId}`);
    };

    const handleViewEmployer = (employerId?: string) => {
        if (employerId) {
            router.push(`/worker/employer/${employerId}`);
        }
    };

    const metaParts = [
        typeof job.distanceKm === "number" ? `${job.distanceKm.toFixed(1)} km` : null,
        job.jobType,
    ].filter(Boolean);

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={() => handleViewJob(job.id)}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleViewJob(job.id);
            }}
            className="flex items-start justify-between gap-3 cursor-pointer rounded-2xl border border-border bg-card p-4 h-full transition-shadow hover:shadow-md"
        >
            <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground text-sm truncate">{job.title}</h3>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleViewEmployer(job.employer?.id);
                    }}
                    className="text-xs text-muted-foreground mt-0.5 truncate hover:text-primary hover:underline text-left"
                >
                    {job.employer?.name || "Unknown"}
                </button>
                <div className="flex flex-wrap items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
                    {metaParts.length > 0 && <span>{metaParts.join(" · ")}</span>}
                    {job.primarySkill && <Badge variant="outline">{job.primarySkill}</Badge>}
                </div>
                {job.location?.formattedAddress && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                        {job.location.formattedAddress}
                    </p>
                )}
            </div>
            <div className="text-right shrink-0">
                <p className="text-base font-bold text-primary">₹{job.minimumWage}</p>
                <p className="text-xs text-muted-foreground">/ day</p>
            </div>
        </div>
    );
}
