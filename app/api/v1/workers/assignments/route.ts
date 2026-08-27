import { NextRequest, NextResponse } from "next/server";
import { OK } from "@/lib/server/http";
import { requireUserId, toErrorResponse } from "@/lib/server/authenticate";
import { getWorkerAssignments } from "@/lib/server/services/worker.service";

export async function GET(req: NextRequest) {
  try {
    const { userId } = requireUserId(req);
    const query = Object.fromEntries(req.nextUrl.searchParams);
    const data = await getWorkerAssignments(userId, query);

    return NextResponse.json({ success: true, data }, { status: OK });
  } catch (error) {
    return toErrorResponse(error);
  }
}
