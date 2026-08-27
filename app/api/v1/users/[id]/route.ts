import { NextRequest, NextResponse } from "next/server";
import { OK } from "@/lib/server/http";
import { requireUserId, toErrorResponse } from "@/lib/server/authenticate";
import { getPublicProfile } from "@/lib/server/services/user.service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    requireUserId(req);
    const { id } = await params;
    const user = await getPublicProfile(id);

    return NextResponse.json({ success: true, user }, { status: OK });
  } catch (error) {
    return toErrorResponse(error);
  }
}
