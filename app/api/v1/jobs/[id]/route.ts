import { NextRequest, NextResponse } from "next/server";
import { OK } from "@/lib/server/http";
import { requireUserId, toErrorResponse } from "@/lib/server/authenticate";
import { deactivateJob, getJobById } from "@/lib/server/services/job.service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = requireUserId(req);
    const { id } = await params;
    const data = await getJobById(userId, id);

    return NextResponse.json({ success: true, data }, { status: OK });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = requireUserId(req);
    const { id } = await params;
    const data = await deactivateJob(userId, id);

    return NextResponse.json(
      { success: true, message: "Job closed successfully", data },
      { status: OK },
    );
  } catch (error) {
    return toErrorResponse(error);
  }
}
