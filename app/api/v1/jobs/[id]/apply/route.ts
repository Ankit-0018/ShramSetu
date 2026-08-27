import { NextRequest, NextResponse } from "next/server";
import { CREATED } from "@/lib/server/http";
import { requireUserId, toErrorResponse } from "@/lib/server/authenticate";
import { applyToJob } from "@/lib/server/services/job.service";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = requireUserId(req);
    const { id } = await params;
    const data = await applyToJob(userId, id);

    return NextResponse.json(
      { success: true, message: "Application submitted successfully", data },
      { status: CREATED },
    );
  } catch (error) {
    return toErrorResponse(error);
  }
}
