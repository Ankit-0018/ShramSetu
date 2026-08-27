import { apiFetch } from "@/lib/api/client";
import { z } from "zod";
import { JobType } from "../types/job";

const JobInputSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(1000).optional(),
  imageUrls: z.array(z.string()).optional(),
  minimumWage: z.number().min(100).max(100000),
  primarySkill: z.string().min(1),
  jobType: z.enum(["FULL_TIME", "PART_TIME", "ONE_TIME"]),
  latitude: z.number(),
  longitude: z.number(),
});

export type JobInput = z.infer<typeof JobInputSchema>;

export async function createJob(data: JobInput) {
  const parsed = JobInputSchema.parse(data);

  const res = await apiFetch<{ success: boolean; data: any }>(
    "/api/v1/jobs",
    { method: "POST", body: parsed },
  );

  return res.data;
}

export async function applyToJob(jobId: string) {
  const res = await apiFetch<{ success: boolean; data: any }>(
    `/api/v1/jobs/${jobId}/apply`,
    { method: "POST" },
  );

  return res.data;
}

export async function deleteJob(jobId: string) {
  const res = await apiFetch<{ success: boolean; data: any }>(
    `/api/v1/jobs/${jobId}`,
    { method: "PATCH" },
  );

  return res.data;
}
