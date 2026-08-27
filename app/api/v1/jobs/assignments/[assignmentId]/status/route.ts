import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { OK } from "@/lib/server/http";
import { requireUserId, toErrorResponse } from "@/lib/server/authenticate";
import { updateAssignmentStatus } from "@/lib/server/services/job.service";

const assignmentStatusSchema = z.object({
  status: z.enum(["IN_PROGRESS", "COMPLETED", "CANCELLED"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> },
) {
  try {
    const { userId } = requireUserId(req);
    const { assignmentId } = await params;
    const body = await req.json();
    const { status } = assignmentStatusSchema.parse(body);

    const result = await updateAssignmentStatus(userId, assignmentId, status);

    return NextResponse.json(
      { success: true, message: result.message, data: result.data },
      { status: OK },
    );
  } catch (error) {
    return toErrorResponse(error);
  }
}
