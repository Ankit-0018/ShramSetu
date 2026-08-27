import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { OK } from "@/lib/server/http";
import { requireUserId, toErrorResponse } from "@/lib/server/authenticate";
import { updateApplicationStatus } from "@/lib/server/services/job.service";

const applicationStatusSchema = z.object({
  status: z.enum(["ACCEPTED", "REJECTED"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ applicationId: string }> },
) {
  try {
    const { userId } = requireUserId(req);
    const { applicationId } = await params;
    const body = await req.json();
    const { status } = applicationStatusSchema.parse(body);

    const result = await updateApplicationStatus(userId, applicationId, status);

    return NextResponse.json(
      {
        success: true,
        message: result.message,
        data: {
          application: result.application,
          ...(result.assignment && { assignment: result.assignment }),
        },
      },
      { status: OK },
    );
  } catch (error) {
    return toErrorResponse(error);
  }
}
