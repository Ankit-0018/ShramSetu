import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { CREATED } from "@/lib/server/http";
import { requireUserId, toErrorResponse } from "@/lib/server/authenticate";
import { rateAssignment } from "@/lib/server/services/job.service";

const ratingSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> },
) {
  try {
    const { userId } = requireUserId(req);
    const { assignmentId } = await params;
    const body = await req.json();
    const { rating, comment } = ratingSchema.parse(body);

    const data = await rateAssignment(userId, assignmentId, rating, comment);

    return NextResponse.json(
      { success: true, message: "Rating submitted successfully", data },
      { status: CREATED },
    );
  } catch (error) {
    return toErrorResponse(error);
  }
}
