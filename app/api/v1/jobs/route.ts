import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { CREATED, OK } from "@/lib/server/http";
import { requireUserId, toErrorResponse } from "@/lib/server/authenticate";
import { createJob, getNearbyJobs } from "@/lib/server/services/job.service";

export async function GET(req: NextRequest) {
  try {
    const { userId } = requireUserId(req);
    const query = Object.fromEntries(req.nextUrl.searchParams);
    const data = await getNearbyJobs(userId, query);

    return NextResponse.json({ success: true, data }, { status: OK });
  } catch (error) {
    return toErrorResponse(error);
  }
}

const createJobSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(1000).optional(),
  imageUrls: z.array(z.string()).optional(),
  minimumWage: z.number().positive(),
  primarySkill: z.string().min(1),
  jobType: z.enum(["FULL_TIME", "PART_TIME", "ONE_TIME"]),
  latitude: z.number(),
  longitude: z.number(),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = requireUserId(req);
    const body = await req.json();
    const parsed = createJobSchema.parse(body);

    const data = await createJob({ userId, ...parsed });

    return NextResponse.json(
      { success: true, message: "Job created successfully", data },
      { status: CREATED },
    );
  } catch (error) {
    return toErrorResponse(error);
  }
}
