import { NextRequest, NextResponse } from "next/server";
import { OK } from "@/lib/server/http";
import { requireUserId, toErrorResponse } from "@/lib/server/authenticate";
import { getJobApplications } from "@/lib/server/services/job.service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = requireUserId(req);
    const { id } = await params;
    const query = Object.fromEntries(req.nextUrl.searchParams);
    const data = await getJobApplications(userId, id, query);

    return NextResponse.json({ success: true, data }, { status: OK });
  } catch (error) {
    return toErrorResponse(error);
  }
}
